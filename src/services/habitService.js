import prisma from "../lib/prisma.js";

export const getHabits = async () => {
    return prisma.habit.findMany();
};
