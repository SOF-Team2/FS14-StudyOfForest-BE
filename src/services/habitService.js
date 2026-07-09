import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const getHabits = async (studyId) => {
  return prisma.habit.findMany({
    where: {
      studyId,
      habitStatus: 'ACTIVE',
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
};

export const createHabit = async (studyId, data) => { 
  return prisma.habit.create({
    data: {
      studyId,
      name: data.name,
      startDate: new Date(),
    },
  })
};

export const patchHabit = async (habitId, data) => { 
  return prisma.habit.update({
    where: {
      id: habitId,
    },
    data: {
      name: data.name,
    },
  }) 
} 

export const deleteHabit = async (habitId) => { 
  return prisma.habit.update({
    where: {
      id: habitId,
    },
    data: {
      habitStatus: 'INACTIVE',
      endDate: new Date(),
    }
  })
}