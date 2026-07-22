import * as studyService from "../services/studyService.js";

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
export const getStudies = async (req, res, next) => {
  try {
    // 헤더에서 x-user-id 추출 (비로그인 요청일 수 있으므로 선택적)
    const userId = req.headers["x-user-id"];

    const result = await studyService.listStudies(req.query, userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 스터디 상세 조회
export const getStudy = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    const { studyId } = req.params;

    const result = await studyService.getStudy(studyId, userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 스터디 생성 요청을 처리한다.
export const createStudy = async (req, res) => {
  try {
    return res.status(201).json({
      data: await studyService.createStudy(req.body, req.currentUser),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// 생성자 권한 확인 후 스터디 수정 요청을 처리한다.
export const updateStudy = async (req, res) => {
  try {
    return res.status(200).json({
      data: await studyService.updateStudy(
        req.params.studyId,
        req.body,
        req.currentUser.id,
      ),
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// 생성자 권한 확인 후 스터디 삭제 요청을 처리한다.
export const deleteStudy = async (req, res) => {
  try {
    await studyService.deleteStudy(req.params.studyId);
    return res.status(204).send();
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

// 모집 마감&재개
export const updateRecruiting = async (req, res) => {
   const studyId = req.params.studyId;
  const isRecruiting = req.body.isRecruiting;
  const study = await studyService.updateRecruiting(studyId, isRecruiting);
  res.json(study);
};
