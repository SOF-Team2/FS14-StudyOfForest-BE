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

export async function findUserByLoginId(loginId) {
  return await prisma.user.findUnique({
    where: { loginId },
    select: { id: true },
  });
}

export async function addStudyPoint(studyId, earnedPoint) {
  return await prisma.study.update({
    where: { id: studyId },
    data: { point: { increment: earnedPoint } },
    select: { id: true, point: true },
  });
}

export async function addUserPoint(userId, earnedPoint) {
  return await prisma.user.update({
    where: { id: userId },
    data: { point: { increment: earnedPoint } },
    select: { id: true, point: true },
  });
}

export async function createFocusSession({ userId, studyId, startedAt, durationSeconds, point }) {
  return await prisma.focusSession.create({
    data: { userId, studyId, startedAt, durationSeconds, point },
    select: { id: true, startedAt: true, durationSeconds: true, point: true },
  });
}

export async function findFocusSessions({ userId, studyId }) {
  return await prisma.focusSession.findMany({
    where: {
      studyId,
      ...(userId && { userId }),
    },
    select: {
      id: true,
      startedAt: true,
      durationSeconds: true,
      point: true,
      user: {
        select: { nickname: true },
      },
    },
    orderBy: { startedAt: 'asc' },
  });
}
