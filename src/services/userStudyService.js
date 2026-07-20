import prisma from "../lib/prisma.js";

export const listMyStudies = async (userId) => {
  const memberships = await prisma.studyMember.findMany({
    where: { userId },
    include: {
      study: {
        include: {
          _count: {
            select: { studyMembers: true },
          },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return memberships.map((membership) => {
    const { study } = membership;

    return {
      studyId: study.id,
      name: study.name,
      nickname: study.nickname,
      isOwner: membership.role === "HOST",
      memberCount: study._count.studyMembers,
      capacity: study.maxMembers,
      backgroundType: study.backgroundType,
      backgroundValue: study.backgroundValue,
      point: study.point,
      joinedAt: membership.joinedAt,
    };
  });
};
