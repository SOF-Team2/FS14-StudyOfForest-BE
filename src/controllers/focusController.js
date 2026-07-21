import * as focusService from '../services/focusService.js';

// 오늘의 집중 데이터 조회
export const getFocusData = async (req, res) => {
  try {
    const { studyId } = req.params;
    const data = await focusService.getFocusStudyData(studyId);

    return res.status(200).json({
      success: true,
      message: '오늘의 집중 데이터 조회에 성공했습니다.',
      data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      errorCode: error.code || 'INTERNAL_SERVER_ERROR',
    });
  }
};

// 집중 세션 생성
export async function createFocusSessionController(req, res) {
  try {
    const studyId = req.params.studyId;
    const { startedAt, durationSeconds } = req.body;
    const created = await focusService.createFocusSession({
      studyId,
      userId: req.currentUser.id,
      startedAt: new Date(startedAt),
      durationSeconds,
    });
    res.status(201).json({
      success: true,
      message: '오늘의 집중 세션 생성에 성공했습니다.',
      data: created,  // { id, startedAt, durationSeconds, point, userPoint, studyPoint }
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      errorCode: error.code || 'INTERNAL_SERVER_ERROR',
    })
  }
};

export async function getFocusSessionsController(req, res) {
  try {
    const { studyId } = req.params;
    const { scope } = req.body;

    const data = await focusService.getFocusStatistics({
      userId: req.currentUser.id,
      studyId,
      scope,
    });

    res.status(200).json({
      success: true,
      message: '오늘의 집중 세션 조회에 성공했습니다.',
      data,  // { totalSeconds, totalPoint, sessions }
    })

  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      errorCode: error.code || 'INTERNAL_SERVER_ERROR',
    })
  }
};
