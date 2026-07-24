import * as achievementService from "../services/achievementService.js"

export const getAchievements = async (req, res) => {
  try {
    const userId = req.user?.id ?? req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        error: {
          code: "MISSING_USER_ID",
          message: "x-user-id 헤더가 필요합니다.",
        },
      });
    }
    
    const result = await achievementService.getAchievements(userId);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
};