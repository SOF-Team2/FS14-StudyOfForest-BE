import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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

export async function addFocusPoint(studyId, earnedPoint) {
  return await prisma.study.update({
    where: { id: studyId },
    data: { point: { increment: earnedPoint } },
    select: { id: true, point: true },
  });
}
