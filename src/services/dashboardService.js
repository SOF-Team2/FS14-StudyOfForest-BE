import prisma from "../lib/prisma.js";

const GOAL_MINUTES = 500;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getDashboard = async (userId) => {
  const [todaySessions, weekSessions] = await Promise.all([
    prisma.focusSession.findMany({
      where: { userId, createdAt: { gte: startOfToday() } },
      select: { durationSeconds: true },
    }),
    prisma.focusSession.findMany({
      where: { userId, createdAt: { gte: startOfWeek() } },
      select: { durationSeconds: true },
    }),
  ]);

  const sumSeconds = (arr) =>
    arr.reduce((sum, s) => sum + s.durationSeconds, 0);
  const toMinutes = (sec) => Math.floor(sec / 60);

  const todayMinutes = toMinutes(sumSeconds(todaySessions));
  const weekMinutes = toMinutes(sumSeconds(weekSessions));

  return {
    focus: {
      todayMinutes,
      weekMinutes,
      goalMinutes: GOAL_MINUTES,
      achievementRate: Math.min(
        100,
        Math.round((todayMinutes / GOAL_MINUTES) * 100),
      ),
    },
  };
};
