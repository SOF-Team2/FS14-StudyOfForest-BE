-- CreateEnum
CREATE TYPE "StudyMemberRole" AS ENUM ('HOST', 'MEMBER');

-- CreateEnum
CREATE TYPE "HabitStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "loginId" VARCHAR(20) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nickname" VARCHAR(10) NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Study" (
    "id" TEXT NOT NULL,
    "nickname" VARCHAR(30) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "backgroundType" VARCHAR(20) NOT NULL,
    "backgroundValue" TEXT NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,
    "maxMembers" INTEGER NOT NULL DEFAULT 3,
    "isRecruiting" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "role" "StudyMemberRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyEmoji" (
    "id" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "emoji" VARCHAR(20) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyEmoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "habitStatus" "HabitStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitRecord" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FocusSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FocusSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_loginId_key" ON "User"("loginId");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE INDEX "User_point_idx" ON "User"("point");

-- CreateIndex
CREATE INDEX "Study_createdAt_idx" ON "Study"("createdAt");

-- CreateIndex
CREATE INDEX "Study_point_idx" ON "Study"("point");

-- CreateIndex
CREATE INDEX "Study_deletedAt_idx" ON "Study"("deletedAt");

-- CreateIndex
CREATE INDEX "Study_name_idx" ON "Study"("name");

-- CreateIndex
CREATE INDEX "Study_isRecruiting_idx" ON "Study"("isRecruiting");

-- CreateIndex
CREATE INDEX "StudyMember_userId_idx" ON "StudyMember"("userId");

-- CreateIndex
CREATE INDEX "StudyMember_studyId_idx" ON "StudyMember"("studyId");

-- CreateIndex
CREATE INDEX "StudyMember_studyId_role_idx" ON "StudyMember"("studyId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "StudyMember_userId_studyId_key" ON "StudyMember"("userId", "studyId");

-- CreateIndex
CREATE INDEX "StudyEmoji_studyId_idx" ON "StudyEmoji"("studyId");

-- CreateIndex
CREATE UNIQUE INDEX "StudyEmoji_studyId_emoji_key" ON "StudyEmoji"("studyId", "emoji");

-- CreateIndex
CREATE INDEX "Habit_studyId_idx" ON "Habit"("studyId");

-- CreateIndex
CREATE INDEX "HabitRecord_userId_idx" ON "HabitRecord"("userId");

-- CreateIndex
CREATE INDEX "HabitRecord_habitId_idx" ON "HabitRecord"("habitId");

-- CreateIndex
CREATE UNIQUE INDEX "HabitRecord_habitId_userId_recordDate_key" ON "HabitRecord"("habitId", "userId", "recordDate");

-- CreateIndex
CREATE INDEX "FocusSession_createdAt_idx" ON "FocusSession"("createdAt");

-- CreateIndex
CREATE INDEX "FocusSession_userId_idx" ON "FocusSession"("userId");

-- CreateIndex
CREATE INDEX "FocusSession_studyId_idx" ON "FocusSession"("studyId");

-- AddForeignKey
ALTER TABLE "StudyMember" ADD CONSTRAINT "StudyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyMember" ADD CONSTRAINT "StudyMember_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyEmoji" ADD CONSTRAINT "StudyEmoji_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitRecord" ADD CONSTRAINT "HabitRecord_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitRecord" ADD CONSTRAINT "HabitRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FocusSession" ADD CONSTRAINT "FocusSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FocusSession" ADD CONSTRAINT "FocusSession_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;
