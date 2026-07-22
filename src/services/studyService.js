import * as studyRepository from "../repository/studyRepository.js";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 50;

// 컨트롤러에서 공통 처리할 수 있도록 상태 코드와 에러 코드를 가진 Error를 만든다.
const createError = (statusCode, code, message, details) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

// 페이지와 페이지 크기 query를 양의 정수로 정규화한다.
const normalizePositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
};

// 생성 API에서 허용하는 대체 필드명을 내부 표준 필드명으로 정리한다.
const normalizeCreatePayload = (payload = {}) => ({
  name: normalizeString(payload.name ?? payload.studyName),
  description: normalizeString(payload.description ?? payload.intro ?? payload.introduction),
  backgroundType: normalizeString(payload.backgroundType) || "color",
  backgroundValue: normalizeString(payload.backgroundValue ?? payload.background),
});

const sanitizeStudy = (study) => study;

// 필수 입력값 누락 여부를 확인한다.
const validateRequiredFields = (fields) => {
  const missingFields = Object.entries(fields)
    .filter(([, value]) => !normalizeString(value))
    .map(([field]) => field);

  if (missingFields.length > 0) {
    throw createError(400, "VALIDATION_ERROR", "필수 입력값을 확인해주세요.", {
      missingFields,
    });
  }
};

// 스터디 존재 여부를 확인하고 없으면 404 에러를 발생시킨다.
const getStudyOrThrow = async (studyId) => {
  const study = await studyRepository.findById(studyId);

  if (!study) {
    throw createError(404, "STUDY_NOT_FOUND", "스터디를 찾을 수 없습니다.");
  }

  return study;
};

// 목록 조회 query를 pagination, search, sort 파라미터로 정리한다.
const getListParams = (query = {}) => {
  const page = normalizePositiveInteger(query.page, DEFAULT_PAGE);
  const pageSize = Math.min(
    normalizePositiveInteger(query.pageSize ?? query.limit, DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );
  const keyword = normalizeString(query.keyword ?? query.search);
  const sort = normalizeString(query.sort) || "latest";

  return {
    page,
    pageSize,
    keyword,
    sort,
  };
};

// 스터디 목록 조회
export const listStudies = async (query = {}, userId) => {
  const params = getListParams(query);
  
  // repository.findAll 호출 시 userId 함께 전달
  const { items, totalCount } = await studyRepository.findAll({
    ...params,
    userId,
  });
  
  const totalPages = Math.ceil(totalCount / params.pageSize);

  return {
    data: {
      items: items.map(sanitizeStudy),
      page: params.page,
      pageSize: params.pageSize,
      totalCount,
      totalPages,
    },
  };
};

// 스터디 단건 상세 조회
export const getStudy = async (studyId, userId) => {
  // repository.findById 호출 시 userId 함께 전달
  const study = await studyRepository.findById(studyId, userId);

  if (!study) {
    throw createError(404, "STUDY_NOT_FOUND", "스터디를 찾을 수 없습니다.");
  }

  return sanitizeStudy(study);
};

// 로그인 사용자의 닉네임으로 스터디를 생성하고 HOST 권한을 연결한다.
export const createStudy = async (payload = {}, currentUser) => {
  const normalizedPayload = normalizeCreatePayload(payload);
  const nickname = normalizeString(currentUser?.nickname);

  validateRequiredFields({
    nickname,
    name: normalizedPayload.name,
    description: normalizedPayload.description,
    backgroundValue: normalizedPayload.backgroundValue,
  });

  const study = await studyRepository.create(
    {
      nickname,
      name: normalizedPayload.name,
      description: normalizedPayload.description,
      backgroundType: normalizedPayload.backgroundType,
      backgroundValue: normalizedPayload.backgroundValue,
    },
    currentUser.id,
  );

  return sanitizeStudy(study);
};

// 생성자 권한이 확인된 요청에서 수정 가능한 스터디 필드만 반영한다.
export const updateStudy = async (studyId, payload = {}, userId) => {
  await getStudyOrThrow(studyId);

  const updates = {};
  const name = normalizeString(payload.name ?? payload.studyName);
  const description = normalizeString(payload.description ?? payload.intro ?? payload.introduction);
  const backgroundType = normalizeString(payload.backgroundType);
  const backgroundValue = normalizeString(payload.backgroundValue ?? payload.background);

  if (name) updates.name = name;
  if (description) updates.description = description;
  if (backgroundType) updates.backgroundType = backgroundType;
  if (backgroundValue) updates.backgroundValue = backgroundValue;

  if (Object.keys(updates).length === 0) {
    throw createError(400, "EMPTY_UPDATE", "수정할 값을 입력해주세요.");
  }

  const updatedStudy = await studyRepository.update(studyId, updates, userId);
  return sanitizeStudy(updatedStudy);
};

// 라우트에서 생성자 권한을 확인한 스터디를 soft delete 처리한다.
export const deleteStudy = async (studyId) => {
  await getStudyOrThrow(studyId);
  return studyRepository.remove(studyId);
};

// 스터디 응원 이모지를 생성하거나 기존 이모지 count를 증가시킨다.
export const addEmoji = async (studyId, payload = {}) => {
  await getStudyOrThrow(studyId);

  const emoji = normalizeString(payload.emoji);

  if (!emoji) {
    throw createError(400, "EMOJI_REQUIRED", "응원 이모지를 입력해주세요.");
  }

  const updatedEmoji = await studyRepository.upsertEmoji(studyId, emoji);

  return {
    id: updatedEmoji.id,
    studyId: updatedEmoji.studyId,
    emoji: updatedEmoji.emoji,
    count: updatedEmoji.count,
  };
};

//모집 마감&재개 
export const updateRecruiting = async (studyId, isRecruiting) => {
  const study = await studyRepository.updateRecruiting(studyId, isRecruiting);
  return study;
}

export default {
  listStudies,
  getStudy,
  createStudy,
  updateStudy,
  deleteStudy,
  addEmoji,
};
