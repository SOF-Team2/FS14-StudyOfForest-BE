import * as userService from '../services/userService.js';

// 요청 헤더의 사용자 ID를 확인하고 검증된 사용자를 다음 단계에 전달함
export const verifyCurrentUser = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "x-user-id 헤더가 필요합니다.",
        errorCode: "USER_ID_REQUIRED",
      });
    }

    const user = await userService.getUserById(userId);

    req.currentUser = user;

    return next();
  } catch (error) {
    const statusCode = error.statusCode ?? 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message ?? "서버 오류가 발생했습니다.",
      errorCode: error.code ?? "INTERNAL_SERVER_ERROR",
    });
  }
};

export default {
  verifyCurrentUser,
};