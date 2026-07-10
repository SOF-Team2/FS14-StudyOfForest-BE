import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const throwError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

export const getHabits = async (studyId) => {
  if (!studyId) {
    throwError(400, "studyId가 필요합니다.");
  }

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

export const updateHabit = async (studyId, habits) => {
  const operations = habits.map((habit) => {
    if (habit.id) {
      return prisma.habit.update({
        where: {
          id: habit.id,
        },
        data: {
          name: habit.name,
          startDate: habit.startDate
        },
      });
    }

    return prisma.habit.create({
      data: {
        studyId,
        name: habit.name,
        startDate: new Date()
      },
    });
  });

  await prisma.$transaction(operations);

  return prisma.habit.findMany({
    where: {
      studyId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

export const deleteHabit = async (habitId) => {
  if (!habitId) {
    throwError(400, "habitId가 필요합니다.");
  }

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
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

export const toggleHabitRecord = async (habitId) => {
  if (!habitId) {
    throwError(400, "habitId가 필요합니다.");
  }

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.habitStatus === "INACTIVE") {
    throwError(404, "습관을 찾을 수 없습니다.");
  }

  const habitRecord = await prisma.habitRecord.findFirst({
    where: {
      habitId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!habitRecord) {
    return prisma.habitRecord.create({
      data: {
        habitId,
        recordDate: new Date(),
        isChecked: true,
      },
    })
  }

  return prisma.habitRecord.update({
    where: { 
      id: habitRecord.id
    },
    data: { 
      isChecked: !habitRecord.isChecked 
    }
  })
}