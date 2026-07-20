/*
  Warnings:

  - Added the required column `userId` to the `HabitRecord` table without a default value. This is not possible if the table is not empty.

*/

-- 로컬 목데이터 삭제 (userId NOT NULL 컬럼 추가를 위해 필요)

-- AlterTable
DELETE FROM "HabitRecord";
ALTER TABLE "HabitRecord" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "HabitRecord_userId_idx" ON "HabitRecord"("userId");

-- AddForeignKey
ALTER TABLE "HabitRecord" ADD CONSTRAINT "HabitRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
