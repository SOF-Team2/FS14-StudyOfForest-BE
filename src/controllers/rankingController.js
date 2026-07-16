import * as rankingService from "../services/rankingService.js";

export const getStudyRankings = async (req, res) => {
  try {
    const result = await rankingService.getStudyRankings();
    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
};