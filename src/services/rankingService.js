import prisma from "../lib/prisma.js";

const getWeekRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 오늘 요일 확인 (일: 0 ~ 토: 6)
  const day = today.getDay();

  // 오늘 날짜가 포함된 이번 주 월요일 계산
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + diffToMonday);

  // 다음 주 월요일 계산
  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(weekStart.getDate() + 7);

  return {
    weekStart,
    nextWeekStart,
  };
};

// 이번 주 획득 포인트 기준으로 스터디 랭킹 조회
export const getStudyRankings = async () => {
  const { weekStart, nextWeekStart } = getWeekRange();
  
  // 이번 주 focusSession을 studyId별로 묶어 포인트 합산
  const rankingGroups = await prisma.focusSession.groupBy({
    by: ["studyId"],
    where: {
      createdAt: {
        gte: weekStart,
        lt: nextWeekStart,
      },
    },
    _sum: {
      point: true,
    },
    orderBy: {
      _sum: {
        point: "desc",
      },
    },
  });

  // 랭킹에 포함된 스터디의 이름 조회
  const studies = await prisma.study.findMany({
    where: {
      id: {
        in: rankingGroups.map((rankingGroup) => rankingGroup.studyId),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // 스터디 id와 name 연결하기
  const studyMap = new Map(
    studies.map((study) => [study.id, study.name])
  );

  return rankingGroups.map((rankedStudy, index) => ({
    rank: index + 1,
    id: rankedStudy.studyId,
    name: studyMap.get(rankedStudy.studyId),
    point: rankedStudy._sum.point,
  }));
};

// 이번 주 획득 포인트 기준으로 유저 랭킹 조회
export const getUserRankings = async () => {
  const { weekStart, nextWeekStart } = getWeekRange();

  const rankingGroups = await prisma.focusSession.groupBy({
    by: ["userId"],
    where: {
      createdAt: {
        gte: weekStart,
        lt: nextWeekStart,
      },
    },
    _sum: {
      point: true,
    },
    orderBy: {
      _sum: {
        point: "desc",
      },
    },
  });

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: rankingGroups.map((rankingGroup) => rankingGroup.userId),
      },
    },
    select: {
      id: true,
      nickname: true,
    },
  });

  const userMap = new Map(
    users.map((user) => [user.id, user.nickname])
  );

  return rankingGroups.map((rankedUser, index) => ({
    rank: index + 1,
    id: rankedUser.userId,
    nickname: userMap.get(rankedUser.userId),
    point: rankedUser._sum.point,
  }));   
};