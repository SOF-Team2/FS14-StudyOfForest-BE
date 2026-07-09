import * as focusService from '../services/focusService.js';

// 오늘의 집중 데이터 조회
export const getFocusData = async (req, res) => {
  try {
    const { studyId } = req.params;
    const { password } = req.body;

    const data = await focusService.getFocusStudyData(studyId, password);

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

// 오늘의 집중 포인트 업데이트
export const updateFocusPointController = async (req, res) => {
  try {
    const { studyId } = req.params;
    const { password, point } = req.body;

    const data = await focusService.updateFocusPoint(studyId, password, point);

    return res.status(200).json({
      success: true,
      message: '오늘의 집중 포인트 업데이트에 성공했습니다.',
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