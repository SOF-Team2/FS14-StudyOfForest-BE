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
    const { habitId } = req.params;

    const result = await habitService.deleteHabit(habitId);

    res.status(200).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

export const createHabitRecord = async (req, res) => {
  try {
    const { habitId } = req.params;

    const result = await habitService.createHabitRecord(habitId);

    res.status(201).send(result);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
}