// prisma/seed.js
import "dotenv/config";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.focusSession.deleteMany();
  await prisma.studyMember.deleteMany();
  await prisma.habitRecord.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.studyEmoji.deleteMany();
  await prisma.study.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("1234", 10);

  const me = await prisma.user.create({
    data: {
      loginId: "test1",
      nickname: "이서윤",
      passwordHash,
      point: 45,
    },
  });

  const minsu = await prisma.user.create({
    data: {
      loginId: "minsu",
      nickname: "민수",
      passwordHash,
      point: 18,
    },
  });

  const seoyeon = await prisma.user.create({
    data: {
      loginId: "seoyeon",
      nickname: "서연",
      passwordHash,
      point: 27,
    },
  });

  const study1 = await prisma.study.create({
    data: {
      nickname: "현지",
      name: "React 스터디",
      description: "React를 함께 공부하는 스터디입니다.",
      backgroundType: "COLOR",
      backgroundValue: "#DDEFE3",
      passwordHash,
      point: 0,
      maxMembers: 6,
      emojis: {
        create: [
          { emoji: "👍", count: 3 },
          { emoji: "🔥", count: 2 },
          { emoji: "💚", count: 1 },
        ],
      },
    },
  });

  const study2 = await prisma.study.create({
    data: {
      nickname: "민수",
      name: "프론트엔드 실전반",
      description: "프론트엔드 실전 문제풀이 스터디입니다.",
      backgroundType: "COLOR",
      backgroundValue: "blue",
      passwordHash,
      point: 18,
      maxMembers: 6,
    },
  });

  const study3 = await prisma.study.create({
    data: {
      nickname: "이서윤",
      name: "CS 면접 준비",
      description: "CS 전공 지식 및 면접 준비 스터디입니다.",
      backgroundType: "COLOR",
      backgroundValue: "#E1EDDE",
      passwordHash,
      point: 27,
      maxMembers: 8,
    },
  });

  await prisma.studyMember.create({
    data: {
      userId: me.id,
      studyId: study2.id,
      role: "MEMBER",
      joinedAt: new Date("2026-07-04T12:30:00.000Z"),
    },
  });
  await prisma.studyMember.create({
    data: { userId: minsu.id, studyId: study2.id, role: "HOST" },
  });
  await prisma.studyMember.create({
    data: { userId: seoyeon.id, studyId: study2.id, role: "MEMBER" },
  });

  await prisma.studyMember.create({
    data: {
      userId: me.id,
      studyId: study3.id,
      role: "HOST",
      joinedAt: new Date("2026-07-03T18:10:00.000Z"),
    },
  });
  await prisma.studyMember.create({
    data: { userId: minsu.id, studyId: study3.id, role: "MEMBER" },
  });
  await prisma.studyMember.create({
    data: { userId: seoyeon.id, studyId: study3.id, role: "MEMBER" },
  });

  const today = new Date();
  today.setHours(9, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.focusSession.create({
    data: {
      userId: me.id,
      studyId: study2.id,
      durationSeconds: 2700,
      point: 5,
      createdAt: today,
    },
  });

  await prisma.focusSession.create({
    data: {
      userId: me.id,
      studyId: study2.id,
      durationSeconds: 7200,
      point: 10,
      createdAt: new Date(yesterday.setHours(10, 0, 0, 0)),
    },
  });
  await prisma.focusSession.create({
    data: {
      userId: me.id,
      studyId: study3.id,
      durationSeconds: 9300,
      point: 12,
      createdAt: new Date(
        new Date(today).setDate(today.getDate() - 2),
      ),
    },
  });

  const habit1 = await prisma.habit.create({
    data: {
      studyId: study1.id,
      name: "알고리즘 1문제 풀기",
      habitStatus: "ACTIVE",
      startDate: new Date("2026-07-08"),
      endDate: new Date("9999-12-31"),
    },
  });

  const habit2 = await prisma.habit.create({
    data: {
      studyId: study1.id,
      name: "React 공식문서 읽기",
      habitStatus: "ACTIVE",
      startDate: new Date("2026-07-08"),
      endDate: new Date("9999-12-31"),
    },
  });

  await prisma.habitRecord.createMany({
    data: [
      {
        habitId: habit1.id,
        recordDate: new Date("2026-07-08"),
        isChecked: false,
      },
      {
        habitId: habit2.id,
        recordDate: new Date("2026-07-08"),
        isChecked: true,
      },
    ],
  });

  console.log("Seed data created");
  console.log("테스트 유저 (me):", { id: me.id, loginId: me.loginId, nickname: me.nickname });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
