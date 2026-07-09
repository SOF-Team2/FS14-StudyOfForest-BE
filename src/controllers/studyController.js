import studyService from "../services/studyService.js";

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

export const getStudies = async (req, res) => {
  try {
    return res.status(200).json(await studyService.listStudies(req.query));
  } catch (error) {
    return sendError(res, error);
  }
};

export const getStudy = async (req, res) => {
  try {
    return res.status(200).json({
      data: await studyService.getStudy(req.params.studyId),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const createStudy = async (req, res) => {
  try {
    return res.status(201).json({
      data: await studyService.createStudy(req.body),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateStudy = async (req, res) => {
  try {
    return res.status(200).json({
      data: await studyService.updateStudy(req.params.studyId, req.body),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const deleteStudy = async (req, res) => {
  try {
    return res.status(200).json({
      data: await studyService.deleteStudy(req.params.studyId, req.body),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const addEmoji = async (req, res) => {
  try {
    return res.status(201).json({
      data: await studyService.addEmoji(req.params.studyId, req.body),
    });
  } catch (error) {
    return sendError(res, error);
  }
};
