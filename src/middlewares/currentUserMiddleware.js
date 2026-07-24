import * as userService from '../services/userService.js';
import * as studyMemberService from '../services/studyMemberService.js';

// 요청 헤더의 사용자 ID를 확인하고 검증된 사용자를 다음 단계에 전달함
export const verifyCurrentUser = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "로그인이 필요합니다..",
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

// 로그인 사용자가 해당 스터디를 만든 HOST인지 확인함
export const requireStudyHost = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const isHost = await studyMemberService.getMember(
      req.currentUser.id,
      studyId,
    );

    if (!isHost) {
      return res.status(403).json({
        success: false,
        message: "스터디 생성자만 이용할 수 있습니다.",
        errorCode: "STUDY_HOST_REQUIRED",
      });
    }

    return next();
  } catch (error) {
    const statusCode = error.statusCode ?? error.status ?? 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message ?? "서버 오류가 발생했습니다.",
      errorCode: error.code ?? "INTERNAL_SERVER_ERROR",
    });
  }
};

// 로그인 사용자가 해당 스터디의 멤버(HOST 또는 참여자)인지 확인함
export const requireStudyMember = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const isMember = await studyMemberService.isStudyMember(
      req.currentUser.id,
      studyId,
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "스터디 참여자만 이용할 수 있습니다.",
        errorCode: "STUDY_MEMBER_REQUIRED",
      });
    }

    return next();
  } catch (error) {
    const statusCode = error.statusCode ?? error.status ?? 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message ?? "서버 오류가 발생했습니다.",
      errorCode: error.code ?? "INTERNAL_SERVER_ERROR",
    });
  }
};

export default {
  verifyCurrentUser,
  requireStudyHost,
  requireStudyMember,
};