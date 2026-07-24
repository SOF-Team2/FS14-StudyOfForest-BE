import * as habitService from "../services/habitService.js";

// 스터디 습관과 현재 유저의 오늘 기록을 조회
export const getHabits = async (req, res) => {
  try {
    const { studyId } = req.params;
    const userId = req.currentUser.id;

    const result = await habitService.getHabits(studyId, userId);

    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

// 스터디 습관을 생성
export const createHabit = async (req, res) => {
  try {
    const { studyId } = req.params;

    const result = await habitService.createHabit(studyId, req.body);

    res.status(201).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

// 스터디 습관을 수정
export const updateHabit = async (req, res) => {
  try {
    const { studyId } = req.params;
    const habits = req.body;
    
    const result = await habitService.updateHabit(studyId, habits);
    
    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

// 스터디 습관을 삭제
export const deleteHabit = async (req, res) => {
  try {
    const { studyId, habitId } = req.params;

    const result = await habitService.deleteHabit(studyId, habitId);

    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

// 현재 유저의 오늘의 습관 기록을 변경
export const toggleHabitRecord = async (req, res) => {
   try {
    const { studyId, habitId } = req.params;

    const result = await habitService.toggleHabitRecord(
      studyId,
      habitId,
      req.currentUser.id,
    );

    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error"
    });
  }
};

// 현재 유저의 주간 습관 기록을 조회
export const getWeeklyHabitRecords = async (req, res) => {
  try {
    const { studyId } = req.params;
    const { date } = req.query;
    const userId = req.currentUser.id;

    const selectedDate = date ? new Date(`${date}T00:00:00`) : new Date();

    const result = await habitService.getWeeklyHabitRecords(studyId, userId, selectedDate);

    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error"
    });
  }
};
