// prisma/seed.js
import "dotenv/config";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.habitRecord.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.studyEmoji.deleteMany();
  await prisma.focusSession.deleteMany();
  await prisma.studyMember.deleteMany();
  await prisma.study.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("1234", 10);

  const user = await prisma.user.create({
    data: {
      loginId: "y2h023451",
      passwordHash,
      nickname: "수정",
      point: 9,   // 아래 세션들의 point 합계
    },
  });

  const user1 = await prisma.user.create({
    data: {
      loginId: "y2h0234512",
      passwordHash,
      nickname: "수정2",
      point: 0,
    },
  });

  const study = await prisma.study.create({
    data: {
      nickname: "현지",
      name: "React 스터디",
      description: "React를 함께 공부하는 스터디입니다.",
      backgroundType: "COLOR",
      backgroundValue: "#DDEFE3",
      passwordHash,
      emojis: {
        create: [
          { emoji: "👍", count: 3 },
          { emoji: "🔥", count: 2 },
          { emoji: "💚", count: 1 },
        ],
      },
      point: 9,
    },
  });

  await prisma.studyMember.create({
    data: {
      userId: user.id,
      studyId: study.id,
      role: "HOST",
    },
  });


  await prisma.studyMember.create({
    data: {
      userId: user1.id,
      studyId: study.id,
      role: "MEMBER",
    },
  });

  const focusSession = await prisma.focusSession.createMany({
    data: [
      {
        userId: user.id,
        studyId: study.id,
        startedAt: new Date("2026-07-19T15:00:00"),
        createdAt: new Date("2026-07-19T15:40:00"),
        durationSeconds: 1800,
        point: 5,
      },
      {
        userId: user.id,
        studyId: study.id,
        startedAt: new Date("2026-07-20T10:00:00"),
        createdAt: new Date("2026-07-20T10:20:00"),
        durationSeconds: 1200,
        point: 4,
      },
      {
        userId: user.id,
        studyId: study.id,
        startedAt: new Date("2026-07-20T14:30:00"),
        createdAt: new Date("2026-07-20T14:35:00"),
        durationSeconds: 300,
        point: 0,
      },
      {
        userId: user1.id,
        studyId: study.id,
        startedAt: new Date("2026-07-20T14:30:00"),
        createdAt: new Date("2026-07-20T14:35:00"),
        durationSeconds: 300,
        point: 0,
      },
    ],
  });

  const habit1 = await prisma.habit.create({
    data: {
      studyId: study.id,
      name: "알고리즘 1문제 풀기",
      habitStatus: "ACTIVE",
      startDate: new Date("2026-07-08"),
      endDate: new Date("9999-12-31"),
    },
  });

  const habit2 = await prisma.habit.create({
    data: {
      studyId: study.id,
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