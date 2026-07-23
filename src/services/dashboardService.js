import { HabitStatus } from "@prisma/client";
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

const getLastWeekRange = (date = new Date()) => {
  const { start: thisWeekStart } = getWeekRange(date);
  const start = new Date(thisWeekStart);
  start.setDate(start.getDate() - 7);
  const end = new Date(thisWeekStart);
  return { start, end };
};

const dateKey = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

const sumSeconds = (arr) => arr.reduce((sum, s) => sum + s.durationSeconds, 0);
const toMinutes = (sec) => Math.floor(sec / 60);

const formatHourMinute = (totalMinutes) => {
  const sign = totalMinutes < 0 ? "-" : "";
  const abs = Math.abs(totalMinutes);
  const hour = Math.floor(abs / 60);
  const minute = abs % 60;
  return `${sign}${hour}시간 ${String(minute).padStart(2, "0")}분`;
};

// 오늘의 집중 카드 (실제 DB)
const getFocusCard = async (userId) => {
  const [todaySessions, yesterdaySessions] = await Promise.all([
    prisma.focusSession.findMany({
      where: { userId, createdAt: { gte: startOfToday() } },
      select: { durationSeconds: true },
    }),
    prisma.focusSession.findMany({
      where: {
        userId,
        createdAt: { gte: startOfYesterday(), lt: startOfToday() },
      },
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
    footerClassName:
      diffMinutes >= 0 ? "dashboard_increase" : "dashboard_decrease",
  };
};

// 완료한 습관 카드 (실제 DB)
const getHabitCard = async (userId) => {
  const today = startOfDay();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const memberships = await prisma.studyMember.findMany({
    where: { userId },
    select: { studyId: true },
  });
  const studyIds = memberships.map((m) => m.studyId);

  const activeHabits = await prisma.habit.findMany({
    where: {
      studyId: { in: studyIds },
      habitStatus: "ACTIVE",
      startDate: { lt: tomorrow },
      OR: [{ endDate: null }, { endDate: { gte: today } }],
    },
    select: { id: true },
  });

  const total = activeHabits.length;
  const habitIds = activeHabits.map((h) => h.id);

  const checkedRecords = total
    ? await prisma.habitRecord.findMany({
        where: {
          userId,
          habitId: { in: habitIds },
          recordDate: { gte: today, lt: new Date(today.getTime() + 86400000) },
          isChecked: true,
        },
        select: { habitId: true },
      })
    : [];

  const current = checkedRecords.length;
  const progress = total ? Math.round((current / total) * 100) : 0;

  return {
    id: "habit",
    label: "완료한 습관",
    description: "오늘의 습관 달성 현황이에요",
    icon: "✓",
    type: "progress",
    current,
    total,
    progress,
    footerLabel: "달성률",
    footerValue: `${progress}%`,
  };
};

// 연속 달성 카드 (실제 DB)
const getStreakCard = async (userId) => {
  const LOOKBACK_DAYS = 90;
  const today = startOfToday();
  const rangeStart = new Date(today);
  rangeStart.setDate(rangeStart.getDate() - LOOKBACK_DAYS);

  const memberships = await prisma.studyMember.findMany({
    where: { userId },
    select: { studyId: true },
  });
  const studyIds = memberships.map((m) => m.studyId);

  const records = await prisma.habitRecord.findMany({
    where: {
      userId,
      isChecked: true,
      recordDate: { gte: rangeStart, lte: today },
      habit: { studyId: { in: studyIds } },
    },
    select: { recordDate: true, habitId: true },
  });

  const checkedByDate = new Map();
  records.forEach((r) => {
    const key = dateKey(r.recordDate);
    if (!checkedByDate.has(key)) checkedByDate.set(key, new Set());
    checkedByDate.get(key).add(r.habitId);
  });

  const activeHabitCount = await prisma.habit.count({
    where: { studyId: { in: studyIds }, habitStatus: "ACTIVE" },
  });

  const ACHIEVEMENT_THRESHOLD = 0.7;

  const isAchieved = (date) => {
    if (activeHabitCount === 0) return false;
    const key = dateKey(date);
    const checkedSet = checkedByDate.get(key);
    const checkedCount = checkedSet ? checkedSet.size : 0;
    return checkedCount / activeHabitCount >= ACHIEVEMENT_THRESHOLD;
  };

  let current = 0;
  const cursor = new Date(today);
  while (isAchieved(cursor)) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  let best = 0;
  let run = 0;
  const scanCursor = new Date(rangeStart);
  while (scanCursor <= today) {
    if (isAchieved(scanCursor)) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
    scanCursor.setDate(scanCursor.getDate() + 1);
  }

  return {
    id: "streak",
    label: "연속 달성",
    description: "꾸준히 공부한 날짜예요",
    icon: "🔥",
    type: "streak",
    value: current,
    footerLabel: "최고 기록",
    footerValue: `${best}일`,
  };
};

const buildMinutesByDayOfWeek = (sessions) => {
  const minutesByDay = [0, 0, 0, 0, 0, 0, 0];
  sessions.forEach((s) => {
    const dayIndex = new Date(s.createdAt).getDay();
    minutesByDay[dayIndex] += toMinutes(s.durationSeconds);
  });
  return minutesByDay;
};

// 요일별 주간 집중시간 (실제 DB)
const getWeeklyFocusCard = async (userId) => {
  const { start: thisWeekStart, end: thisWeekEnd } = getWeekRange();
  const { start: lastWeekStart, end: lastWeekEnd } = getLastWeekRange();

  const [thisWeekSessions, lastWeekSessions] = await Promise.all([
    prisma.focusSession.findMany({
      where: {
        userId,
        createdAt: { gte: thisWeekStart, lt: thisWeekEnd },
      },
      select: { durationSeconds: true, createdAt: true },
    }),
    prisma.focusSession.findMany({
      where: {
        userId,
        createdAt: { gte: lastWeekStart, lt: lastWeekEnd },
      },
      select: { durationSeconds: true },
    }),
  ]);

  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];
  const minutesByDay = buildMinutesByDayOfWeek(thisWeekSessions);
  const order = [1, 2, 3, 4, 5, 6, 0];

  const days = order.map((dayIndex) => ({
    day: dayLabels[dayIndex],
    minutes: minutesByDay[dayIndex],
  }));

  const totalMinutes = minutesByDay.reduce((sum, m) => sum + m, 0);
  const lastWeekTotalMinutes = toMinutes(sumSeconds(lastWeekSessions));
  const diffMinutes = totalMinutes - lastWeekTotalMinutes;

  return {
    id: "weeklyFocus",
    label: "이번 주 집중",
    description: "요일별 집중 시간을 확인해 보세요",
    icon: "📊",
    type: "weeklyChart",
    hour: String(Math.floor(totalMinutes / 60)).padStart(2, "0"),
    minute: String(totalMinutes % 60).padStart(2, "0"),
    days,
    footerLabel: "지난주보다",
    footerValue: `${diffMinutes >= 0 ? "+" : ""}${formatHourMinute(diffMinutes)}`,
    footerClassName:
      diffMinutes >= 0 ? "dashboard_increase" : "dashboard_decrease",
  };
};

export const getDashboard = async (userId) => {
  const [focusCard, habitCard, streakCard, weeklyFocusCard] = await Promise.all(
    [
      getFocusCard(userId),
      getHabitCard(userId),
      getStreakCard(userId),
      getWeeklyFocusCard(userId),
    ],
  );

  return {
    todayStatus: [focusCard, habitCard, streakCard],
    weeklyFocus: weeklyFocusCard.days,
    weeklyFocusCard,
  };
};
