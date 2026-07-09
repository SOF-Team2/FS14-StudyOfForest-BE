import studyRepository from "../repository/studyRepository.js";
import { comparePassword, hashPassword } from "../utils/password.js";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 50;

const createError = (statusCode, code, message, details) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const normalizePositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
};

const normalizeCreatePayload = (payload = {}) => ({
  nickname: normalizeString(payload.nickname),
  name: normalizeString(payload.name ?? payload.studyName),
  description: normalizeString(payload.description ?? payload.intro ?? payload.introduction),
  backgroundType: normalizeString(payload.backgroundType) || "color",
  backgroundValue: normalizeString(payload.backgroundValue ?? payload.background),
  password: normalizeString(payload.password),
  passwordConfirmation: normalizeString(payload.passwordConfirmation ?? payload.passwordConfirm),
});

const sanitizeStudy = (study) => {
  const { passwordHash, password, ...safeStudy } = study;
  return safeStudy;
};

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

const getStudyOrThrow = async (studyId) => {
  const study = await studyRepository.findById(studyId);

  if (!study) {
    throw createError(404, "STUDY_NOT_FOUND", "스터디를 찾을 수 없습니다.");
  }

  return study;
};

const verifyPassword = async (study, password) => {
  if (!normalizeString(password)) {
    throw createError(400, "PASSWORD_REQUIRED", "비밀번호를 입력해주세요.");
  }

  const isValidPassword = await comparePassword(password, study.passwordHash);

  if (!isValidPassword) {
    throw createError(403, "INVALID_PASSWORD", "비밀번호가 일치하지 않습니다.");
  }
};

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

const listStudies = async (query = {}) => {
  const params = getListParams(query);
  const { items, totalCount } = await studyRepository.findAll(params);
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

const getStudy = async (studyId) => {
  const study = await getStudyOrThrow(studyId);
  return sanitizeStudy(study);
};

const createStudy = async (payload = {}) => {
  const normalizedPayload = normalizeCreatePayload(payload);

  validateRequiredFields({
    nickname: normalizedPayload.nickname,
    name: normalizedPayload.name,
    description: normalizedPayload.description,
    backgroundValue: normalizedPayload.backgroundValue,
    password: normalizedPayload.password,
    passwordConfirmation: normalizedPayload.passwordConfirmation,
  });

  if (normalizedPayload.password !== normalizedPayload.passwordConfirmation) {
    throw createError(
      400,
      "PASSWORD_CONFIRMATION_MISMATCH",
      "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    );
  }

  const passwordHash = await hashPassword(normalizedPayload.password);
  const study = await studyRepository.create({
    nickname: normalizedPayload.nickname,
    name: normalizedPayload.name,
    description: normalizedPayload.description,
    backgroundType: normalizedPayload.backgroundType,
    backgroundValue: normalizedPayload.backgroundValue,
    passwordHash,
  });

  return sanitizeStudy(study);
};

const updateStudy = async (studyId, payload = {}) => {
  const study = await getStudyOrThrow(studyId);
  await verifyPassword(study, payload.password);

  const updates = {};
  const name = normalizeString(payload.name ?? payload.studyName);
  const nickname = normalizeString(payload.nickname);
  const description = normalizeString(payload.description ?? payload.intro ?? payload.introduction);
  const backgroundType = normalizeString(payload.backgroundType);
  const backgroundValue = normalizeString(payload.backgroundValue ?? payload.background);

  if (name) updates.name = name;
  if (nickname) updates.nickname = nickname;
  if (description) updates.description = description;
  if (backgroundType) updates.backgroundType = backgroundType;
  if (backgroundValue) updates.backgroundValue = backgroundValue;

  if (Object.keys(updates).length === 0) {
    throw createError(400, "EMPTY_UPDATE", "수정할 값을 입력해주세요.");
  }

  const updatedStudy = await studyRepository.update(studyId, updates);
  return sanitizeStudy(updatedStudy);
};

const deleteStudy = async (studyId, payload = {}) => {
  const study = await getStudyOrThrow(studyId);
  await verifyPassword(study, payload.password);

  return studyRepository.remove(studyId);
};

const addEmoji = async (studyId, payload = {}) => {
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

export default {
  listStudies,
  getStudy,
  createStudy,
  updateStudy,
  deleteStudy,
  addEmoji,
};
