export const createMockUserStudies = async (userId) => {
  return [
    {
      studyId: "study-2",
      name: "프론트엔드 실전반",
      nickname: "민수",
      isOwner: false,
      memberCount: 3,
      capacity: 6,
      backgroundType: "COLOR",
      backgroundValue: "#E0F1F5",
      point: 18,
      joinedAt: new Date("2026-07-04T12:30:00.000Z"),
    },
    {
      studyId: "study-3",
      name: "CS 면접 준비",
      nickname: "서연",
      isOwner: true,
      memberCount: 5,
      capacity: 8,
      backgroundType: "COLOR",
      backgroundValue: "#E1EDDE",
      point: 27,
      joinedAt: new Date("2026-07-03T18:10:00.000Z"),
    },
  ];
};
