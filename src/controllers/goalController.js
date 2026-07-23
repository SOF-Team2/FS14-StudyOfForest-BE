import * as goalService from "../services/goalService.js";

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

const getUserId = (req) => req.user?.id ?? req.headers["x-user-id"];

// 이번 주 목표 카드 조회
export const getMyGoal = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(400).json({
        error: {
          code: "MISSING_USER_ID",
          message: "x-user-id 헤더가 필요합니다.",
        },
      });
    }

    return res.status(200).json({
      data: await goalService.getGoalCard(userId),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateMyGoal = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(400).json({
        error: {
          code: "MISSING_USER_ID",
          message: "x-user-id 헤더가 필요합니다.",
        },
      });
    }

    const { targetFocusHours } = req.body;

    const goal = await goalService.setGoal(userId, { targetFocusHours });

    return res.status(200).json({ data: goal });
  } catch (error) {
    return sendError(res, error);
  }
};