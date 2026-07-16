import prisma from "../lib/prisma.js";

export const listMyStudies = async (userId) => {
  const membershops = await prisma.studyMember.findMany({
    where: { userId },
    include: { study: true },
    orderBy: { joinedAt: "desc" },
  });

  return await Promise.all(
    membershops.map(async (m) => {
      const memberCount = await prisma.studyMember.count({
        where: { studyId: m.studyId },
      });

      return {
        studyId: m.study.id,
        name: m.study.name,
        nickname: m.study.nickname,
        isOwner: m.role === "HOST",
        memberCount,
        capacity: m.study.maxMembers,
        backgroundType: m.study.backgroundType,
        backgroundValue: m.study.backgroundValue,
        point: m.study.point,
        joinedAt: m.joinedAt,
      };
    }),
  );
};
