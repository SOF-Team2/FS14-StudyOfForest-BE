// * as -> export하는 모든 것을 하나의 객체로 묶어서 가져오기
import * as userRepository from "../repository/userRepository.js";
import { hashPassword } from "../utils/password.js";

// 영문 소문자와 숫자만 사용, 4자 이상 20자 이하
const LOGIN_ID_REGEX = /^[a-z0-9]{4,20}$/;

// 영문, 숫자 최소 한글자 포함, 전체 길이는 8자 이상 20자 이하
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;

// 닉네임은 한글, 영문, 숫자만 사용, 2자 이상 10자 이하
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,10}$/;

// Controller가 적절한 HTTP 응답을 만들 수 있도록 상태 코드와 에러 코드를 포함한 Error 객체를 생성함
const createError = (statusCode, code, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;

  return error;
};

// 아이디와 닉네임 앞뒤에 실수로 입력한 공백을 제거함
const normalizeText = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

// 비밀번호는 사용자가 입력한 값 자체를 유지
const normalizePassword = (value) => {
  return typeof value === "string" ? value : "";
};

// 회원가입 입력값이 규칙에 맞는지 검사함
const validateSignupInput = ({ loginId, password, nickname }) => {
  if (!loginId) {
    throw createError(
      400,
      "LOGIN_ID_REQUIRED",
      "로그인 아이디를 입력해주세요.",
    );
  }

  if (!LOGIN_ID_REGEX.test(loginId)) {
    throw createError(
      400,
      "INVALID_LOGIN_ID",
      "로그인 아이디는 영문 소문자와 숫자를 사용해 4자 이상 20자 이하로 입력해주세요.",
    );
  }

  if (!password) {
    throw createError(
      400,
      "PASSWORD_REQUIRED",
      "비밀번호를 입력해주세요.",
    );
  }

  if (!PASSWORD_REGEX.test(password)) {
    throw createError(
      400,
      "INVALID_PASSWORD",
      "비밀번호는 영문과 숫자를 포함해 8자 이상 20자 이하로 입력해주세요.",
    );
  }

  if (!nickname) {
    throw createError(
      400,
      "NICKNAME_REQUIRED",
      "닉네임을 입력해주세요.",
    );
  }

  if (!NICKNAME_REGEX.test(nickname)) {
    throw createError(
      400,
      "INVALID_NICKNAME",
      "닉네임은 한글, 영문, 숫자를 사용해 2자 이상 10자 이하로 입력해주세요.",
    );
  }
};

// 회원가입 규칙을 검사하고 정보를 전달 받아 새로운 사용자를 생성함
export const signupUser = async (payload = {}) => {
  const signupData = {
    loginId: normalizeText(payload.loginId),
    password: normalizePassword(payload.password),
    nickname: normalizeText(payload.nickname),
  };

  validateSignupInput(signupData);

  const existingLoginIdUser =
    await userRepository.findUserByLoginId(signupData.loginId);

  if (existingLoginIdUser) {
    throw createError(
      409,
      "LOGIN_ID_ALREADY_EXISTS",
      "이미 사용 중인 로그인 아이디입니다.",
    );
  }

  const existingNicknameUser =
    await userRepository.findUserByNickname(signupData.nickname);

  if (existingNicknameUser) {
    throw createError(
      409,
      "NICKNAME_ALREADY_EXISTS",
      "이미 사용 중인 닉네임입니다.",
    );
  }

  const passwordHash = await hashPassword(signupData.password);

  return userRepository.createUser({
    loginId: signupData.loginId,
    passwordHash,
    nickname: signupData.nickname,
  });
};

export default {
  signupUser,
};