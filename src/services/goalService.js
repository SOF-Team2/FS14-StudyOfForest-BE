import prisma from "../lib/prisma.js";

// ---------- 날짜 유틸 ----------
const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getWeekRange = (date = new Date()) => {
  const start = startOfDay(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
};

const sumSeconds = (arr) => arr.reduce((sum, s) => sum + s.durationSeconds, 0);
const toMinutes = (sec) => Math.floor(sec / 60);
const toHours = (minutes) => minutes / 60;

const getWeeklyFocusMinutes = async (userId, weekStart, weekEnd) => {
  const sessions = await prisma.focusSession.findMany({
    where: {
      userId,
      createdAt: { gte: weekStart, lt: weekEnd },
    },
    select: { durationSeconds: true },
  });

  return toMinutes(sumSeconds(sessions));
};

export const getGoal = async (userId) => {
  const goal = await prisma.userGoal.findUnique({ where: { userId } });

  return {
    targetFocusHours: goal?.targetFocusHours ?? 0,
  };
};

export const setGoal = async (userId, { targetFocusHours }) => {
  const hours = Number(targetFocusHours);

  if (!Number.isFinite(hours) || hours < 0) {
    const error = new Error("targetFocusHours는 0 이상의 숫자여야 합니다.");
    error.statusCode = 400;
    throw error;
  }

  const goal = await prisma.userGoal.upsert({
    where: { userId },
    update: { targetFocusHours: hours },
    create: { userId, targetFocusHours: hours },
  });

  return {
    targetFocusHours: goal.targetFocusHours,
  };
};

export const getGoalCard = async (userId) => {
  const { start: weekStart, end: weekEnd } = getWeekRange();
  const goal = await getGoal(userId);

  const focusMinutes = await getWeeklyFocusMinutes(userId, weekStart, weekEnd);
  const focusHours = Math.round(toHours(focusMinutes) * 10) / 10;

  const hasGoal = goal.targetFocusHours > 0;
  const progress = hasGoal
    ? Math.min(100, Math.round((focusHours / goal.targetFocusHours) * 100))
    : 0;
  const remainingHours = Math.max(
    0,
    Math.round((goal.targetFocusHours - focusHours) * 10) / 10,
  );

  return {
    id: "weeklyGoal",
    label: "이번 주 목표",
    description: hasGoal
      ? "목표까지 조금만 더 힘내세요"
      : "이번 주 목표를 설정해보세요",
    icon: "🎯",
    type: "goal",
    hasGoal,
    targetHours: goal.targetFocusHours,
    currentHours: focusHours,
    remainingHours,
    progress,
    summaryText: hasGoal
      ? `이번 주 목표 ${goal.targetFocusHours}시간 중 ${focusHours}시간을 달성했어요.`
      : null,
    footerLabel: "남은 목표",
    footerValue: hasGoal ? `${remainingHours}시간` : "-",
  };
};