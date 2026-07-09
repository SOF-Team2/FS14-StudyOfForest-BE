import prisma from "../lib/prisma.js";

const studyInclude = {
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
};

const toIsoString = (date) => (date ? date.toISOString() : null);

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

  return {
    id: study.id,
    nickname: study.nickname,
    name: study.name,
    description: study.description,
    backgroundType: study.backgroundType,
    backgroundValue: study.backgroundValue,
    passwordHash: study.passwordHash,
    point: study.point,
    points: study.point,
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

const createOrderBy = (sort) => {
  const orderByMap = {
    latest: [{ createdAt: "desc" }],
    oldest: [{ createdAt: "asc" }],
    points_desc: [{ point: "desc" }, { createdAt: "desc" }],
    points_asc: [{ point: "asc" }, { createdAt: "desc" }],
  };

  return orderByMap[sort] ?? orderByMap.latest;
};

const findAll = async ({ page, pageSize, keyword, sort }) => {
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
      include: studyInclude,
    }),
    prisma.study.count({ where }),
  ]);

  return {
    items: studies.map(toStudyDto),
    totalCount,
  };
};

const findById = async (studyId) => {
  const study = await prisma.study.findFirst({
    where: {
      id: studyId,
      deletedAt: null,
    },
    include: studyInclude,
  });

  return toStudyDto(study);
};

const create = async (study) => {
  const createdStudy = await prisma.study.create({
    data: {
      nickname: study.nickname,
      name: study.name,
      description: study.description,
      backgroundType: study.backgroundType,
      backgroundValue: study.backgroundValue,
      passwordHash: study.passwordHash,
      point: 0,
    },
    include: studyInclude,
  });

  return toStudyDto(createdStudy);
};

const update = async (studyId, updates) => {
  const updatedStudy = await prisma.study.update({
    where: {
      id: studyId,
    },
    data: updates,
    include: studyInclude,
  });

  return toStudyDto(updatedStudy);
};

const remove = async (studyId) => {
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

const upsertEmoji = async (studyId, emoji) => {
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

export default {
  findAll,
  findById,
  create,
  update,
  remove,
  upsertEmoji,
};
