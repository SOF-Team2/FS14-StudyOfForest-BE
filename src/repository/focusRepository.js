import prisma from '../lib/prisma.js';

export const findFocusStudyById = async (studyId) => {
  return await prisma.study.findFirst({
    where: {
      id: studyId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      point: true,
      emojis: {
        select: {
          emoji: true,
          count: true,
        },
        orderBy: {
          count: 'desc',
        },
        take: 3,
      },
    },
  });
};

// 비밀번호 검증에 사용할 비밀번호 해시 값 도출
export async function findStudyPasswordById(studyId) {
  return await prisma.study.findFirst({
    where: { id: studyId, deletedAt: null },
    select: { id: true, passwordHash: true },
  });
}
export async function addFocusPoint(studyId, earnedPoint) {
  return await prisma.study.update({
    where: { id: studyId },
    data: { point: { increment: earnedPoint } },
    select: { id: true, point: true },
  });
}