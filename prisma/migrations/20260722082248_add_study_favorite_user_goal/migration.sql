-- CreateTable
CREATE TABLE "StudyFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetFocusHours" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudyFavorite_userId_idx" ON "StudyFavorite"("userId");

-- CreateIndex
CREATE INDEX "StudyFavorite_studyId_idx" ON "StudyFavorite"("studyId");

-- CreateIndex
CREATE UNIQUE INDEX "StudyFavorite_userId_studyId_key" ON "StudyFavorite"("userId", "studyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGoal_userId_key" ON "UserGoal"("userId");

-- AddForeignKey
ALTER TABLE "StudyFavorite" ADD CONSTRAINT "StudyFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyFavorite" ADD CONSTRAINT "StudyFavorite_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGoal" ADD CONSTRAINT "UserGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
