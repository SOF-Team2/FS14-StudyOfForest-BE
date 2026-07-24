import "dotenv/config";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. 기존 데이터 초기화 (외래키 참조 관계 순서 고려)
  //await prisma.studyFavorite.deleteMany(); // ✅ 추가: 즐겨찾기 초기화
  await prisma.focusSession.deleteMany();
  await prisma.habitRecord.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.studyEmoji.deleteMany();
  await prisma.studyMember.deleteMany();
  await prisma.study.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("as12345678", 10);

  // 2. 유저 생성
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

  // 3. 스터디 생성
  const study1 = await prisma.study.create({
    data: {
      nickname: me.nickname,
      name: "React 스터디",
      description: "React를 함께 공부하는 스터디입니다.",
      backgroundType: "COLOR",
      backgroundValue: "#DDEFE3",
      point: 9,
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
      nickname: minsu.nickname,
      name: "프론트엔드 실전반",
      description: "프론트엔드 실전 문제풀이 스터디입니다.",
      backgroundType: "COLOR",
      backgroundValue: "blue",
      point: 18,
      maxMembers: 6,
    },
  });

  const study3 = await prisma.study.create({
    data: {
      nickname: me.nickname,
      name: "CS 면접 준비",
      description: "CS 전공 지식 및 면접 준비 스터디입니다.",
      backgroundType: "COLOR",
      backgroundValue: "#E1EDDE",
      point: 27,
      maxMembers: 8,
    },
  });

  // 4. 스터디 멤버 생성
  await prisma.studyMember.createMany({
    data: [
      { userId: me.id, studyId: study1.id, role: "HOST" },
      { userId: minsu.id, studyId: study1.id, role: "MEMBER" },
      {
        userId: me.id,
        studyId: study2.id,
        role: "MEMBER",
        joinedAt: new Date("2026-07-04T12:30:00.000Z"),
      },
      { userId: minsu.id, studyId: study2.id, role: "HOST" },
      { userId: seoyeon.id, studyId: study2.id, role: "MEMBER" },
      {
        userId: me.id,
        studyId: study3.id,
        role: "HOST",
        joinedAt: new Date("2026-07-03T18:10:00.000Z"),
      },
      { userId: minsu.id, studyId: study3.id, role: "MEMBER" },
      { userId: seoyeon.id, studyId: study3.id, role: "MEMBER" },
    ],
  });

  // 5. ✅ 추가: 스터디 즐겨찾기 데이터 생성
  // await prisma.studyFavorite.createMany({
  //   data: [
  //     { userId: me.id, studyId: study1.id }, // '이서윤'이 'React 스터디' 즐겨찾기
  //     { userId: me.id, studyId: study3.id }, // '이서윤'이 'CS 면접 준비' 즐겨찾기
  //     { userId: minsu.id, studyId: study2.id }, // '민수'가 '프론트엔드 실전반' 즐겨찾기
  //     { userId: seoyeon.id, studyId: study1.id }, // '서연'이 'React 스터디' 즐겨찾기
  //   ],
  // });

  // 6. 몰입 세션(FocusSession) 생성
  await prisma.focusSession.createMany({
    data: [
      {
        userId: me.id,
        studyId: study1.id,
        startedAt: new Date("2026-07-19T15:00:00"),
        createdAt: new Date("2026-07-19T15:30:00"),
        durationSeconds: 1800,
        point: 5,
      },
      {
        userId: me.id,
        studyId: study1.id,
        startedAt: new Date("2026-07-20T10:00:00"),
        createdAt: new Date("2026-07-20T10:20:00"),
        durationSeconds: 1200,
        point: 4,
      },
      {
        userId: me.id,
        studyId: study1.id,
        startedAt: new Date("2026-07-20T14:30:00"),
        createdAt: new Date("2026-07-20T14:35:00"),
        durationSeconds: 300,
        point: 0,
      },
      {
        userId: minsu.id,
        studyId: study1.id,
        startedAt: new Date("2026-07-20T14:30:00"),
        createdAt: new Date("2026-07-20T14:35:00"),
        durationSeconds: 300,
        point: 0,
      },
      {
        userId: me.id,
        studyId: study2.id,
        startedAt: new Date("2026-07-21T09:00:00"),
        createdAt: new Date("2026-07-21T09:45:00"),
        durationSeconds: 2700,
        point: 5,
      },
      {
        userId: me.id,
        studyId: study2.id,
        startedAt: new Date("2026-07-20T10:00:00"),
        createdAt: new Date("2026-07-20T12:00:00"),
        durationSeconds: 7200,
        point: 10,
      },
      {
        userId: me.id,
        studyId: study3.id,
        startedAt: new Date("2026-07-19T09:00:00"),
        createdAt: new Date("2026-07-19T11:35:00"),
        durationSeconds: 9300,
        point: 12,
      },
    ],
  });

  // 7. 습관(Habit) 및 습관 기록(HabitRecord) 생성
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

  // 날짜 유틸: n일 전 자정
  const daysAgo = (n) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - n);
    return d;
  };

  const habitRecordData = [];

  [0, 1, 2].forEach((n) => {
    const date = daysAgo(n);
    habitRecordData.push(
      { habitId: habit1.id, userId: me.id, recordDate: date, isChecked: true },
      { habitId: habit2.id, userId: me.id, recordDate: date, isChecked: true },
    );
  });

  [10, 11, 12, 13, 14].forEach((n) => {
    const date = daysAgo(n);
    habitRecordData.push(
      { habitId: habit1.id, userId: me.id, recordDate: date, isChecked: true },
      { habitId: habit2.id, userId: me.id, recordDate: date, isChecked: true },
    );
  });

  await prisma.habitRecord.createMany({
    data: habitRecordData,
  });

  console.log("Seed data created successfully!");
  console.log("테스트 유저 (me):", {
    id: me.id,
    loginId: me.loginId,
    nickname: me.nickname,
  });
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
