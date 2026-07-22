import * as habitService from "../services/habitService.js";

export const getHabits = async (req, res) => {
  try {
    const { studyId } = req.params;

    const result = await habitService.getHabits(studyId);

    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

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

export const getWeeklyHabitRecords = async (req, res) => {
  try {
    const { studyId } = req.params;
    const { date } = req.query;

    const selectedDate = date ? new Date(`${date}T00:00:00`) : new Date();

    const result = await habitService.getWeeklyHabitRecords(studyId, selectedDate);

    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error"
    });
  }
}
