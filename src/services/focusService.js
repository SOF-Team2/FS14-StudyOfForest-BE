import { find_focus_study_by_id } from '../repository/focusRepository.js'

export const get_focus_study_data = async (study_id) => {
  const study = await find_focus_study_by_id(study_id)

  if (!study) {
    const error = new Error('오늘의 집중 데이터를 찾을 수 없습니다.')
    error.status = 404
    error.code = 'FOCUS_STUDY_NOT_FOUND'
    throw error
  }

  return {
    study_id: study.id,
    study_name: study.name,
    current_point: study.point,
    emojis: (study.emojis ?? []).map((emoji_item) => ({
      emoji: emoji_item.emoji,
      count: emoji_item.count,
    })),
  }
}