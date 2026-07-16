import * as userStudyService from "../services/userStudyService.js";

const sendError = (res, error) => {
  const statusCode = error.statusCode ?? 500;

  return res.status(statusCode).json({
    error: {
      code: error.code ?? "INTERNAL_SERVER_ERROR",
      message: error.message ?? "서버 오류가 발생했습니다.",
    },
    details: error.details,
  });
};

export const getMyStudies = async (req, res) => {
  try {
    const userId = req.user?.id ?? "mock-user-id";

    return res.status(200).json({
      data: await userStudyService.listMyStudies(userId),
    });
  } catch (error) {
    return sendError(res, error);
  }
};
