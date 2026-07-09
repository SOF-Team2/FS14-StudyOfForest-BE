import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const find_focus_study_by_id = async (study_id) => {
  return await prisma.study.findFirst({
    where: {
      id: study_id,
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