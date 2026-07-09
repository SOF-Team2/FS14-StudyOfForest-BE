import { get_focus_study_data } from '../services/focusService.js'

export const get_focus_data = async (req, res) => {
  try {
    const { id } = req.params

    const data = await get_focus_study_data(id)

    return res.status(200).json({
      success: true,
      message: '오늘의 집중 데이터 조회에 성공했습니다.',
      data,
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      error_code: error.code || 'INTERNAL_SERVER_ERROR',
    })
  }
}