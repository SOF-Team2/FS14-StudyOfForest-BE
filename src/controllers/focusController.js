import * as focusService from '../services/focusService.js';

//함수 네이밍 컨벤션 통일
export const getFocusData = async (req, res) => {
  try {
    const { studyId } = req.params;
    const { password } = req.body;

    //함수 네이밍 컨벤션 통일
    const data = await focusService.getFocusStudyData(studyId, password);

    return res.status(200).json({
      success: true,
      message: '오늘의 집중 데이터 조회에 성공했습니다.',
      data: data,
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      errorCode: error.code || 'INTERNAL_SERVER_ERROR',
    })
  }
}

export async function updateFocusPointController(req, res) {
  try {
    const studyId = req.params.studyId;
    const { password, point } = req.body;

    const updated = await focusService.updateFocusPoint(studyId, password, point);
    res.status(200).json({
      success: true,
      message: '포인트 지급에 성공했습니다.',
      data: updated,  // { id, point }
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      errorCode: error.code || 'INTERNAL_SERVER_ERROR',
    })
  }
}