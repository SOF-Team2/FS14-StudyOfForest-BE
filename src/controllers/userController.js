import * as userService from "../services/userService.js";

// Service에서 발생한 오류를 HTTP 응답으로 변환한다.
const sendError = (res, error) => {
  const statusCode = error.statusCode ?? 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message ?? "서버 오류가 발생했습니다.",
    errorCode: error.code ?? "INTERNAL_SERVER_ERROR",
  });
};

// 회원가입 요청을 처리한다.
export const signup = async (req, res) => {
  try {
    const user = await userService.signupUser(req.body);
    return res.status(201).json({
      success: true,
      message: "회원가입에 성공했습니다.",
      data: user,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export default {
  signup,
};