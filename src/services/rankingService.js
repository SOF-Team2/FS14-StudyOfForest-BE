import prisma from "../lib/prisma.js";

// 포인트 점수 기준 내림차순으로 스터디 랭킹 가져오기
export const getStudyRankings = async () => {
  const studies = await prisma.study.findMany({
    orderBy: {
      point: "desc",
    },
    select: {
      id: true,
      name: true,
      point: true,
    },
  })

  return studies.map((study, index) => ({
    rank: index + 1,
    ...study,
  }));
};