import 'dotenv/config'
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { comparePassword } from '../utils/password.js';
import * as focusRepository from '../repository/focusRepository.js';

const { PrismaClient } = pkg;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// 스터디 데이터 조회
export const getFocusStudyData = async (studyId) => {
  const study = await focusRepository.findFocusStudyById(studyId)

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

//해야할 것 
//Study 모델에 point 필드 확인/추가 후 migrate, 비밀번호 검증 함수, 
//집중 조회 API(POST /study/:id/focus) 작성
//백엔드 - DB 설계 + 비밀번호 검증 + 조회 API
//focus.service/controller/router (조회까지)

//비밀번호 검증 기능 구현 (함수로 분리)
export async function verifyStudyPassword(studyId, password) {

  //아이디와 패스워드를 받는다.
  const study = await focusRepository.findFocusStudyById(studyId);

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

export async function updateFocusPoint(studyId, password, point) {
  // 1) 비밀번호 검증 (같은 파일의 함수 재사용 — 틀리면 여기서 에러가 던져짐)
  await verifyStudyPassword(studyId, password);

  // 2) 넘어온 포인트 값이 올바른지 확인
  if (typeof point !== 'number' || point < 0) {
    const error = new Error('포인트 값이 올바르지 않습니다.');
    error.status = 400;
    throw error;
  }

  // 3) 기존 포인트에 더하기
  const updated = await focusRepository.addFocusPoint(studyId, point);
  return updated; // { id, point }의 형식으로 반환
}