import * as favoriteService from "../services/favoriteService.js";

export const toggleFavorite = async (req, res, next) => {
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

    const {
      studyId
    } = req.params;

    const result = await favoriteService.toggleFavorite(userId, studyId);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        isFavorite: result.isFavorite,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const getMyFavoriteStudies = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      page = 1, limit = 10
    } = req.query;

    const result = await favoriteService.getMyFavoriteStudies(
      userId,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      data: result.list,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}