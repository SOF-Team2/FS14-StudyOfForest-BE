import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const throwError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

export const getHabits = async (studyId) => {
  if (!studyId) {
    throwError(400, "studyId가 필요합니다.");
  }

  return prisma.habit.findMany({
    where: {
      studyId,
      habitStatus: "ACTIVE",
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const createHabit = async (studyId, data) => {
  if (!studyId) {
    throwError(400, "studyId가 필요합니다.");
  }

  if (!data.name) {
    throwError(400, "습관 이름을 입력해주세요.");
  }

  return prisma.habit.create({
    data: {
      studyId,
      name: data.name,
      startDate: new Date(),
    },
  });
};

export const patchHabit = async (habitId, data) => {
  if (!habitId) {
    throwError(400, "habitId가 필요합니다.");
  }
  
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.habitStatus === "INACTIVE") {
    throwError(404, "습관을 찾을 수 없습니다.");
  }

  return prisma.habit.update({
    where: {
      id: habitId,
    },
    data: {
      name: data.name,
    },
  });
};

export const deleteHabit = async (habitId) => {
  if (!habitId) {
    throwError(400, "habitId가 필요합니다.");
  }

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.habitStatus === "INACTIVE") {
    throwError(404, "습관을 찾을 수 없습니다.");
  }

  return prisma.habit.update({
    where: {
      id: habitId,
    },
    data: {
      habitStatus: "INACTIVE",
      endDate: new Date(),
    },
  });
};