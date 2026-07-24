import prisma from "../lib/prisma.js";

const throwError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

// 업적 달성 기준
const ACHIEVEMENT_RULES = [
  {
    achievementType: "FOCUS_SEED",
    minPoint: 1,
  },
  {
    achievementType: "IMMERSION_SPROUT",
    minPoint: 50,
  },
  {
    achievementType: "STEADY_SAPLING",
    minPoint: 100,
  },
  {
    achievementType: "FOCUS_TREE",
    minPoint: 200,
  },
  {
    achievementType: "FOREST_MASTER",
    minPoint: 500,
  },
]

// 유저가 이미 획득한 업적 조회
export const getAchievements = async (userId) => {
  return prisma.userAchievement.findMany({
    where: {
      userId,
    },
    select: {
      achievementType: true,
      achievedAt: true,
    },
    orderBy: {
      achievedAt: "asc"
    }
  });
}

// 포인트를 기준으로 새 업적 확인 및 저장
export const checkAchievements = async (userId) => {
  // 현재 유저의 누적 포인트 조회
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      point: true,
    }
  });

  if (!user) {
    throwError(404, "유저를 찾을 수 없습니다.");
  }

  // 현재 누적 포인트로 달성 가능한 업적 필터링
  const eligibleAchievements = ACHIEVEMENT_RULES.filter((achievement) => {
    return user.point >= achievement.minPoint;
  });

  // 기존에 획득한 업적 조회
  const existingAchievements = await getAchievements(userId);

  // 이미 획득한 업적을 제외하고 새로 달성한 업적만 필터링
  const newAchievements = eligibleAchievements.filter((achievement) => {
    return !existingAchievements.some((existing) => {
      return existing.achievementType === achievement.achievementType;
    });
  });

  // 전달할 데이터 형태로 변환
  const achievementData = newAchievements.map((achievement) => {
    return {
      userId,
      achievementType: achievement.achievementType,
    };
  });

  // 새로 달성한 업적이 있을 경우에만 DB에 저장
  if (newAchievements.length > 0) {
    await prisma.userAchievement.createMany({
      data: achievementData
    });
  }

  return newAchievements;
}