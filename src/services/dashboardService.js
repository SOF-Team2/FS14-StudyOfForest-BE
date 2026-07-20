import prisma from "../lib/prisma.js";

// ---------- 날짜 유틸 ----------
const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfToday = () => startOfDay(new Date());

const startOfYesterday = () => {
  const d = startOfToday();
  d.setDate(d.getDate() - 1);
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

// 오늘의 집중 카드 (실제 DB)
const getFocusCard = async (userId) => {
  const [todaySessions, yesterdaySessions] = await Promise.all([
    prisma.focusSession.findMany({
      where: { userId, createdAt: { gte: startOfToday() } },
      select: { durationSeconds: true },
    }),
    prisma.focusSession.findMany({
      where: { userId, createdAt: { gte: startOfYesterday(), lt: startOfToday() } },
      select: { durationSeconds: true },
    }),
  ]);

  const todayTotalMinutes = toMinutes(sumSeconds(todaySessions));
  const yesterdayTotalMinutes = toMinutes(sumSeconds(yesterdaySessions));
  const diffMinutes = todayTotalMinutes - yesterdayTotalMinutes;

  return {
    id: "focus",
    label: "오늘의 집중",
    description: "오늘 기록한 집중 시간이에요",
    icon: "⏱",
    type: "time",
    hour: String(Math.floor(todayTotalMinutes / 60)).padStart(2, "0"),
    minute: String(todayTotalMinutes % 60).padStart(2, "0"),
    footerLabel: "어제보다",
    footerValue: `${diffMinutes >= 0 ? "+" : ""}${diffMinutes}분`,
    footerClassName: diffMinutes >= 0 ? "dashboard_increase" : "dashboard_decrease",
  };
};

// 완료한 습관 카드 (임시 mock)
const getHabitCardMock = async () => {
  const current = 5;
  const total = 8;
  return {
    id: "habit",
    label: "완료한 습관",
    description: "오늘의 습관 달성 현황이에요",
    icon: "✓",
    type: "progress",
    current,
    total,
    progress: Math.round((current / total) * 100),
    footerLabel: "달성률",
    footerValue: `${Math.round((current / total) * 100)}%`,
  };
};

// 연속 달성 카드 (임시 mock)
const getStreakCardMock = async () => {
  return {
    id: "streak",
    label: "연속 달성",
    description: "꾸준히 공부한 날짜예요",
    icon: "🔥",
    type: "streak",
    value: 3,
    footerLabel: "최고 기록",
    footerValue: "12일",
  };
};

// 요일별 주간 집중시간 (실제 DB)
const getWeeklyFocus = async (userId) => {
  const { start } = getWeekRange();

  const sessions = await prisma.focusSession.findMany({
    where: { userId, createdAt: { gte: start } },
    select: { durationSeconds: true, createdAt: true },
  });

  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];
  const minutesByDay = [0, 0, 0, 0, 0, 0, 0];

  sessions.forEach((s) => {
    const dayIndex = new Date(s.createdAt).getDay();
    minutesByDay[dayIndex] += toMinutes(s.durationSeconds);
  });

  const order = [1, 2, 3, 4, 5, 6, 0];
  return order.map((dayIndex) => ({
    day: dayLabels[dayIndex],
    minutes: minutesByDay[dayIndex],
  }));
};

export const getDashboard = async (userId) => {
  const [focusCard, habitCard, streakCard, weeklyFocus] = await Promise.all([
    getFocusCard(userId),
    getHabitCardMock(),
    getStreakCardMock(),
    getWeeklyFocus(userId),
  ]);

  return {
    todayStatus: [focusCard, habitCard, streakCard],
    weeklyFocus,
  };
};