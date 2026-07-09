import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 프론트에서 earnedPoint를 보내주어야 함!
// 포인트 계산 함수 (더하기)
export async function addFocusPoint(studyId, earnedPoint) {
  return await prisma.study.update({
    where: { id: studyId },
    data: { point: { increment: earnedPoint } },
    select: { id: true, point: true },
  });
}