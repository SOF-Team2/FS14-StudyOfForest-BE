import * as focusRepository from '../repository/focusRepository.js';
import { checkAchievements } from './achievementService.js';

// 스터디 데이터 조회
export const getFocusStudyData = async (studyId) => {
  const study = await focusRepository.findFocusStudyById(studyId);

  if (!study) {
    const error = new Error('오늘의 집중 데이터를 찾을 수 없습니다.')
    error.status = 404
    error.code = 'FOCUS_STUDY_NOT_FOUND';
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
  };
}

// 포인트 검증
export function verifyDurationSeconds(durationSeconds) {
  if (!Number.isInteger(durationSeconds) || durationSeconds <= 0 || durationSeconds > 86400) {
    const error = new Error('올바른 값이 아닙니다.');
    error.status = 400;
    error.code = 'INVALID_DURATION_SECONDS';
    throw error;
  };
  return durationSeconds;
}

// 포인트 계산
export function calculatePoint(durationSeconds) {
  if (durationSeconds < 600) return 0;
  const point = 3 + Math.floor(((durationSeconds / 60) - 10) / 10);
  return point;
};


export async function createFocusSession({ userId, studyId, startedAt, durationSeconds }) {
  try {
    await verifyDurationSeconds(durationSeconds);
    const point = calculatePoint(durationSeconds);

    const session = await focusRepository.createFocusSession({
      userId,
      studyId,
      startedAt: new Date(startedAt),
      durationSeconds,
      point
    });
    const updatedUser = await focusRepository.addUserPoint(userId, point);
    const updatedStudy = await focusRepository.addStudyPoint(studyId, point);
    // 유저 포인트 중가 후 새로 달성한 업적 확인 및 저장
    const newAchievements = await checkAchievements(userId);

    return {
      id: session.id,
      startedAt: session.startedAt,
      durationSeconds: session.durationSeconds,
      point: session.point,
      userPoint: updatedUser.point,
      studyPoint: updatedStudy.point,
      newAchievements,
    };
  } catch (error) {
    throw error;
  }
}

export async function getFocusStatistics({ userId, studyId, scope }) {
  try {
    const sessions = await focusRepository.findFocusSessions({
      userId: scope === 'all' ? undefined : userId,
      studyId,
    });

    const totalSeconds = sessions.reduce((sum, session) => sum + session.durationSeconds, 0);
    //scope가 all이면 팀 전체, me면 이 스터디에서 번 내 점수 (스터디에서만)
    const totalPoint = sessions.reduce((sum, session) => sum + session.point, 0);

    return { totalSeconds, totalPoint, sessions };
  } catch (error) {
    throw error;
  }
}
