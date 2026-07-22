-- 스터디 접근 권한을 비밀번호 대신 StudyMember의 HOST 권한으로 관리한다.
ALTER TABLE "Study" DROP COLUMN "passwordHash";
