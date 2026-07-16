export const createMockDashboard = async (userId) => {
  return {
    habit: {
      totalHabits: 4,
      completedToday: 3,
      todayCompletionRate: 75,
      weeklyCompletionRate: 68,
      habits: [
        { habitId: "habit-1", name: "물 8잔 마시기", isCheckedToday: true },
        { habitId: "habit-2", name: "아침 스트레칭", isCheckedToday: true },
        { habitId: "habit-3", name: "독서 30분", isCheckedToday: false },
      ],
    },
    focus: {
      todayMinutes: 45,
      weekMinutes: 320,
      goalMinutes: 500,
      achievementRate: 64,
    },
  };
};
