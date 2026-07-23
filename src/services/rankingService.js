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

  // 지난 주 월요일 계산
  const previousWeekStart = new Date(weekStart);
  previousWeekStart.setDate(weekStart.getDate() - 7);

  // 다음 주 월요일 계산
  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(weekStart.getDate() + 7);

  return {
    weekStart,
    previousWeekStart,
    nextWeekStart,
  };
};

// 동점자 처리 (포인트가 같으면 같은 순위 부여, 다음 순위는 건너뛰기)
const addRank = (rankings) => {
  let previousItemPoint = null;
  let currentRank = 0;

  return rankings.map((item, index) => {
    if (item.point !== previousItemPoint) {
      currentRank = index + 1;
    }

    previousItemPoint = item.point;

    return {
      ...item,
      rank: currentRank,
    };
  });
};

// 이번 주 획득 포인트 기준으로 스터디 랭킹 조회
export const getStudyRankings = async () => {
  const { weekStart, nextWeekStart } = getWeekRange();

  // 삭제되지 않은 스터디 조회
  const activeStudies = await prisma.study.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const activeStudyIds = activeStudies.map((study) => study.id);

  // 이번 주 focusSession을 활성 스터디별로 묶어 포인트 합산
  const rankingGroups = await prisma.focusSession.groupBy({
    by: ["studyId"],
    where: {
      studyId: {
        in: activeStudyIds,
      },
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

  // 스터디 id와 name 연결하기
  const studyMap = new Map(
    activeStudies.map((study) => [study.id, study.name])
  );

  // 집계된 포인트와 스터디 이름을 랭킹 응답 형태로 변환
  const studyRankings = rankingGroups.map((rankedStudy) => ({
    id: rankedStudy.studyId,
    name: studyMap.get(rankedStudy.studyId),
    point: rankedStudy._sum.point,
  }));

  return addRank(studyRankings);
};

// 이번 주 획득 포인트 기준으로 유저 랭킹 조회
export const getUserRankings = async () => {
  const { weekStart, nextWeekStart } = getWeekRange();

  // 이번 주 focusSession을 userId별로 묶어 포인트 합산
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

  // 랭킹에 포함된 유저의 닉네임 조회
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

  // 유저 id와 닉네임 연결하기
  const userMap = new Map(
    users.map((user) => [user.id, user.nickname])
  );

  // 집계된 포인트와 유저 닉네임을 랭킹 응답 형태로 변환
  const userRankings = rankingGroups.map((rankedUser) => ({
    id: rankedUser.userId,
    nickname: userMap.get(rankedUser.userId),
    point: rankedUser._sum.point,
  }));

  return addRank(userRankings);
};

// 지난주 스터디 및 유저 공동 1위 조회
export const getPreviousRankings = async () => {
  const { previousWeekStart, weekStart } = getWeekRange();

  // 삭제되지 않은 스터디 조회
  const activeStudies = await prisma.study.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const activeStudyIds = activeStudies.map((study) => study.id);

  // 지난주 focusSession을 활성 스터디별로 묶어 포인트 합산
  const studyRankingGroups = await prisma.focusSession.groupBy({
    by: ["studyId"],
    where: {
      studyId: {
        in: activeStudyIds,
      },
      createdAt: {
        gte: previousWeekStart,
        lt: weekStart,
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

  // 지난주 focusSession을 userId별로 묶어 포인트 합산
  const userRankingGroups = await prisma.focusSession.groupBy({
    by: ["userId"],
    where: {
      createdAt: {
        gte: previousWeekStart,
        lt: weekStart,
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

  // 스터디와 유저의 지난주 최고 포인트 확인
  const topStudyPoint = studyRankingGroups[0]?._sum.point;
  const topUserPoint = userRankingGroups[0]?._sum.point;

  // 최고 포인트와 같은 공동 1위 스터디와 유저 찾기
  // 지난주 기록이 없으면 빈 배열로 설정
  const topStudyGroups = 
    topStudyPoint === undefined 
    ? [] 
    : studyRankingGroups.filter(
    (study) => study._sum.point === topStudyPoint
  );

  const topUserGroups = 
    topUserPoint === undefined
    ? []
    : userRankingGroups.filter(
    (user) => user._sum.point === topUserPoint
  );

  // 공동 1위 유저 정보 조회
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: topUserGroups.map((user) => user.userId),
      },
    },
    select: {
      id: true,
      nickname: true,
    },
  });

  // id를 기준으로 스터디 이름과 유저 닉네임 찾을 수 있도록 Map 생성
  const studyMap = new Map(
    activeStudies.map((study) => [study.id, study.name])
  );
  const userMap = new Map(
    users.map((user) => [user.id, user.nickname])
  );

  // 공동 1위 스터디와 유저 정보 반환
  return {
    studies: topStudyGroups.map((study) => ({
      id: study.studyId,
      name: studyMap.get(study.studyId),
      point: study._sum.point,
    })),
    users: topUserGroups.map((user) => ({
      id: user.userId,
      nickname: userMap.get(user.userId),
      point: user._sum.point,
    })),
  };
};