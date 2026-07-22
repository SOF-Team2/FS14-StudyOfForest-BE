-- 기존 스터디의 닉네임과 현재 사용자 닉네임이 정확히 일치하면 HOST 관계를 복구한다.
INSERT INTO "StudyMember" ("id", "userId", "studyId", "role", "joinedAt")
SELECT
  gen_random_uuid()::text,
  "User"."id",
  "Study"."id",
  'HOST',
  CURRENT_TIMESTAMP
FROM "Study"
INNER JOIN "User" ON "User"."nickname" = "Study"."nickname"
WHERE "Study"."deletedAt" IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "StudyMember"
    WHERE "StudyMember"."studyId" = "Study"."id"
      AND "StudyMember"."role" = 'HOST'
  )
ON CONFLICT ("userId", "studyId")
DO UPDATE SET "role" = 'HOST';
