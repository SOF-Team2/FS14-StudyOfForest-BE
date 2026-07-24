import prisma from "../lib/prisma.js";

const throwError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

// 스터디 습관과 현재 유저의 오늘 기록을 조회
export const getHabits = async (studyId, userId) => {
  if (!studyId) {
    throwError(400, "studyId가 필요합니다.");
  }

  if (!userId) {
    throwError(400, "userId가 필요합니다.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return prisma.study.findUnique({
    where: {
      id: studyId,
    },
    include: {
      habits: {
        where: {
          habitStatus: "ACTIVE",
        },
        include: {
          habitRecords: {
            where: {
              userId,
              recordDate: {
                gte: today,
                lt: tomorrow,
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};

// 스터디 습관을 생성
export const createHabit = async (studyId, data) => {
  if (!studyId) {
    throwError(400, "studyId가 필요합니다.");
  }

  if (!data.name) {
    throwError(400, "습관 이름을 입력해주세요.");
  }

  return prisma.habit.create({
    data: {
      studyId,
      name: data.name,
      startDate: new Date(),
    },
  });
};

// 스터디 습관을 수정
export const updateHabit = async (studyId, habits) => {
  const operations = habits.map((habit) => {
    if (habit.id) {
      return prisma.habit.updateMany({
        where: {
          id: habit.id,
          studyId,
          habitStatus: "ACTIVE",
        },
        data: {
          name: habit.name,
        },
      });
    }

    return prisma.habit.create({
      data: {
        studyId,
        name: habit.name,
        startDate: new Date(),
      },
    });
  });

  await prisma.$transaction(operations);

  return prisma.habit.findMany({
    where: {
      studyId,
      habitStatus: "ACTIVE",
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

// 스터디 습관을 삭제
export const deleteHabit = async (studyId, habitId) => {
  if (!studyId || !habitId) {
    throwError(400, "habitId가 필요합니다.");
  }

  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      studyId,
    },
  });

  if (!habit || habit.habitStatus === "INACTIVE") {
    throwError(404, "습관을 찾을 수 없습니다.");
  }

  return prisma.habit.update({
    where: {
      id: habitId,
    },
    data: {
      habitStatus: "INACTIVE",
      endDate: new Date(),
    },
  });
};

// 현재 유저의 오늘 습관 기록을 변경
export const toggleHabitRecord = async (studyId, habitId, userId) => {
  if (!studyId || !habitId || !userId) {
    throwError(400, "habitId가 필요합니다.");
  }

  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      studyId,
    },
  });

  if (!habit || habit.habitStatus === "INACTIVE") {
    throwError(404, "습관을 찾을 수 없습니다.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const habitRecord = await prisma.habitRecord.findFirst({
    where: {
      habitId,
      userId,
      recordDate: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (!habitRecord) {
    return prisma.habitRecord.create({
      data: {
        habitId,
        userId,
        recordDate: today,
        isChecked: true,
      },
    });
  }

  return prisma.habitRecord.update({
    where: {
      id: habitRecord.id,
    },
    data: {
      isChecked: !habitRecord.isChecked,
    },
  });
};

// 기준일이 포함된 주의 시작일과 종료일 계산
function getWeekRange(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + diff);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return { start, end };
}

// 현재 유저의 주간 습관 기록을 조회
export const getWeeklyHabitRecords = async (studyId, userId, date) => {
  if (!studyId) {
    throwError(400, "studyId가 필요합니다.");
  }

  if (!userId) {
    throwError(400, "userId가 필요합니다.");
  }
  
  const { start, end } = getWeekRange(date);

  return prisma.habit.findMany({
    where: {
      studyId,
      habitStatus: "ACTIVE",
    },
    include: {
      habitRecords: {
        where: {
          userId,
          recordDate: {
            gte: start,
            lt: end,
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
