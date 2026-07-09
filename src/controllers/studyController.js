import studyService from "../services/studyService.js";

// 서비스 계층에서 발생한 에러를 공통 응답 형식으로 변환한다.
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

// 스터디 목록 조회 요청을 처리한다.
export const getStudies = async (req, res) => {
  try {
    return res.status(200).json(await studyService.listStudies(req.query));
  } catch (error) {
    return sendError(res, error);
  }
};

// 단일 스터디 상세 조회 요청을 처리한다.
export const getStudy = async (req, res) => {
  try {
    return res.status(200).json({
      data: await studyService.getStudy(req.params.studyId),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// 스터디 생성 요청을 처리한다.
export const createStudy = async (req, res) => {
  try {
    return res.status(201).json({
      data: await studyService.createStudy(req.body),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// 비밀번호 검증 후 스터디 수정 요청을 처리한다.
export const updateStudy = async (req, res) => {
  try {
    return res.status(200).json({
      data: await studyService.updateStudy(req.params.studyId, req.body),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// 비밀번호 검증 후 스터디 삭제 요청을 처리한다.
export const deleteStudy = async (req, res) => {
  try {
    return res.status(200).json({
      data: await studyService.deleteStudy(req.params.studyId, req.body),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// 특정 스터디에 응원 이모지를 추가하거나 count를 증가시킨다.
export const addEmoji = async (req, res) => {
  try {
    return res.status(201).json({
      data: await studyService.addEmoji(req.params.studyId, req.body),
    });
  } catch (error) {
    return sendError(res, error);
  }
};
