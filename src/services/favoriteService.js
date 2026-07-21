import prisma from "../lib/prisma.js";

export const toggleFavorite = async (userId, studyId) => {
  const study = await prisma.study.findFirst({
    where: {
      id: studyId,
      deletedAt: null
    },
  });

  if (!study) {
    const error = new Error("존재하지 않거나 삭제된 스터디입니다.");
    error.statusCode = 404;
    throw error;
  }

  const existingFavorite = await prisma.studyFavorite.findUnique({
    where: {
      userId_studyId: {
        userId,
        studyId,
      },
    },
  });

  // 1-3. 상태에 따라 추가 또는 삭제 처리
  if (existingFavorite) {
    await prisma.studyFavorite.delete({
      where: {
        userId_studyId: {
          userId,
          studyId,
        },
      },
    });

    return {
      isFavorite: false,
      message: "즐겨찾기에서 해제되었습니다.",
    };
  } else {
    await prisma.studyFavorite.create({
      data: {
        userId,
        studyId,
      },
    });

    return {
      isFavorite: true,
      message: "즐겨찾기에 추가되었습니다.",
    };
  }
}

export const getMyFavoriteStudies = async (userId, page = 1, limit = 10) => {
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [favorites, totalCount] = await Promise.all([
    prisma.studyFavorite.findMany({
      where: {
        userId,
        study: {
          deletedAt: null,
        },
      },
      include: {
        study: {
          include: {
            emojis: true,
            _count: {
              select: {
                studyMembers: true
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limitNum,
    }),
    prisma.studyFavorite.count({
      where: {
        userId,
        study: {
          deletedAt: null,
        },
      },
    }),
  ]);

  const list = favorites.map((fav) => {
    const {
      study,
      createdAt: favoritedAt
    } = fav;
    const {
      _count,
      ...studyData
    } = study;

    return {
      ...studyData,
      currentMembers: _count.studyMembers,
      favoritedAt,
      isFavorite: true,
    };
  });

  return {
    list,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalCount,
      limit: limitNum,
    },
  };
}