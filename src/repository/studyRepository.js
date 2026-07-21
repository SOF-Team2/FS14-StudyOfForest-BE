import prisma from "../lib/prisma.js";

// ✅ 1. userId를 인자로 받아 동적으로 include 객체를 생성하는 함수로 변경
const getStudyInclude = (userId) => ({
  emojis: {
    orderBy: [{ count: "desc" }, { updatedAt: "desc" }],
    take: 3,
  },
  habits: {
    orderBy: {
      createdAt: "asc",
    },
    include: {
      habitRecords: {
        orderBy: {
          recordDate: "asc",
        },
      },
    },
  },
  // 로그인한 유저의 즐겨찾기 정보만 쏙 가져옴 (비로그인 시 false)
  studyFavorites: userId
    ? {
        where: { userId },
      }
    : false,
  studyMembers: userId
    ? {
        where: {
          userId,
          role: "HOST",
        },
        select: {
          id: true,
        },
      }
    : false,
});

const toIsoString = (date) => (date ? date.toISOString() : null);

// Prisma 조회 결과를 API 응답에서 사용하기 쉬운 DTO 형태로 변환한다.
const toStudyDto = (study) => {
  if (!study) {
    return null;
  }

  const emojis = (study.emojis ?? []).map((emoji) => ({
    id: emoji.id,
    emoji: emoji.emoji,
    count: emoji.count,
    createdAt: toIsoString(emoji.createdAt),
    updatedAt: toIsoString(emoji.updatedAt),
  }));

  // ✅ 2. 가져온 studyFavorites 배열을 바탕으로 isFavorite(boolean) 계산
  const isFavorite =
    Array.isArray(study.studyFavorites) && study.studyFavorites.length > 0;
  const isOwner =
    Array.isArray(study.studyMembers) && study.studyMembers.length > 0;

  return {
    id: study.id,
    nickname: study.nickname,
    name: study.name,
    description: study.description,
    backgroundType: study.backgroundType,
    backgroundValue: study.backgroundValue,
    point: study.point,
    points: study.point,
    isRecruiting: study.isRecruiting,
    isFavorite, // ✅ DTO 응답 필드에 추가
    isOwner,
    createdAt: toIsoString(study.createdAt),
    updatedAt: toIsoString(study.updatedAt),
    deletedAt: toIsoString(study.deletedAt),
    emojis,
    topEmojis: emojis,
    habitRecords: (study.habits ?? []).map((habit) => ({
      habitId: habit.id,
      habitName: habit.name,
      habitStatus: habit.habitStatus,
      startDate: toIsoString(habit.startDate),
      endDate: toIsoString(habit.endDate),
      records: (habit.habitRecords ?? []).map((record) => ({
        id: record.id,
        recordDate: toIsoString(record.recordDate),
        isChecked: record.isChecked,
      })),
    })),
  };
};

// 검색어가 있을 때 스터디 이름, 소개, 닉네임 검색 조건을 만든다.
const createSearchWhere = (keyword) => {
  if (!keyword) {
    return {};
  }

  return {
    OR: [
      { name: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
      { nickname: { contains: keyword, mode: "insensitive" } },
    ],
  };
};

// 클라이언트가 전달한 sort 값에 맞는 Prisma orderBy 조건을 만든다.
const createOrderBy = (sort) => {
  const orderByMap = {
    latest: [{ createdAt: "desc" }],
    oldest: [{ createdAt: "asc" }],
    points_desc: [{ point: "desc" }, { createdAt: "desc" }],
    points_asc: [{ point: "asc" }, { createdAt: "desc" }],
  };

  return orderByMap[sort] ?? orderByMap.latest;
};

// ✅ 3. findAll에서 userId를 받아 getStudyInclude(userId) 전달
export const findAll = async ({ page, pageSize, keyword, sort, userId }) => {
  const where = {
    deletedAt: null,
    ...createSearchWhere(keyword),
  };
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [studies, totalCount] = await prisma.$transaction([
    prisma.study.findMany({
      where,
      orderBy: createOrderBy(sort),
      skip,
      take,
      include: getStudyInclude(userId),
    }),
    prisma.study.count({ where }),
  ]);

  return {
    items: studies.map(toStudyDto),
    totalCount,
  };
};

// ✅ 4. findById에서 userId를 추가 인자로 전달받음
export const findById = async (studyId, userId) => {
  const study = await prisma.study.findFirst({
    where: {
      id: studyId,
      deletedAt: null,
    },
    include: getStudyInclude(userId),
  });

  return toStudyDto(study);
};

// 새 스터디를 생성하고 연결 데이터를 포함해 반환한다.
export const create = async (study, userId) => {
  const createdStudy = await prisma.study.create({
    data: {
      nickname: study.nickname,
      name: study.name,
      description: study.description,
      backgroundType: study.backgroundType,
      backgroundValue: study.backgroundValue,
      point: 0,
      studyMembers: {
        create: {
          userId,
          role: "HOST",
        },
      },
    },
    include: getStudyInclude(userId),
  });

  return toStudyDto(createdStudy);
};

// 전달받은 수정 데이터를 저장하고 연결 데이터를 포함해 반환한다.
export const update = async (studyId, updates, userId) => {
  const updatedStudy = await prisma.study.update({
    where: {
      id: studyId,
    },
    data: updates,
    include: getStudyInclude(userId),
  });

  return toStudyDto(updatedStudy);
};

// 스터디를 실제 삭제하지 않고 deletedAt을 기록해 soft delete 처리한다.
export const remove = async (studyId) => {
  await prisma.study.update({
    where: {
      id: studyId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return {
    id: studyId,
    deleted: true,
  };
};

// 같은 스터디에 같은 이모지가 있으면 count를 증가시키고, 없으면 새 이모지 row를 생성한다.
export const upsertEmoji = async (studyId, emoji) => {
  return prisma.studyEmoji.upsert({
    where: {
      studyId_emoji: {
        studyId,
        emoji,
      },
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      studyId,
      emoji,
      count: 1,
    },
  });
};

// 모집 버튼 구현 
export const updateRecruiting = async (studyId, isRecruiting) => {
  const study = await prisma.study.update({
    where: {
      id: studyId,
    },
    data: {
      isRecruiting: isRecruiting,
    },
  });
  return study;
};

export default {
  findAll,
  findById,
  create,
  update,
  remove,
  upsertEmoji,
  updateRecruiting,
};
