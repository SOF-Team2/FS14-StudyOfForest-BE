import 'dotenv/config'
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { comparePassword } from '../utils/password.js';
import * as focusRepository from '../repository/focusRepository.js';

const { PrismaClient } = pkg;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// 스터디 데이터 조회
export const getFocusStudyData = async (studyId, password) => {

  //비밀번호 검증
  await verifyStudyPassword(studyId, password);

  const study = await focusRepository.findFocusStudyById(studyId);

  if (!study) {
    const error = new Error('오늘의 집중 데이터를 찾을 수 없습니다.')
    error.status = 404
    error.code = 'FOCUS_STUDY_NOT_FOUND'
    throw error
  }

  return {
    studyId: study.id,
    studyName: study.name,
    currentPoint: study.point,
    emojis: (study.emojis ?? []).map((emojiItem) => ({
      emoji: emojiItem.emoji,
      count: emojiItem.count,
    })),
  }
}

//비밀번호 검증 기능 구현 (함수로 분리)
export async function verifyStudyPassword(studyId, password) {

  //아이디와 패스워드를 받는다. (기존 조회에서는 해시값을 받아오지 않기 때문에 따로 분리해서 작업함)
  const study = await focusRepository.findStudyPasswordById(studyId);

  //스터디가 없을 경우 404
  if (!study) {
    const error = new Error('오늘의 집중 페이지에 접근 할 수 없습니다.');
    error.status = 404;
    throw error;
  }

  //비밀번호가 동일하지 않을 경우 401
  const isMatch = await comparePassword(password, study.passwordHash);
  if (!isMatch) {
    const error = new Error('비밀번호가 올바르지 않습니다.');
    error.status = 401;
    throw error;
  }
  //스터디가 있고, 패스워드가 동일하면 스터디를 던져준다.
  return study;
}