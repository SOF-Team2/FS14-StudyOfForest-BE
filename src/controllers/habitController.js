import * as habitService from '../services/habitService.js';

export const getHabits = async (req, res) => {
    const { studyId } = req.params
    const result = await habitService.getHabits(studyId);

    res.send(result);
};

export const createHabit = async (req, res) => {
  const { studyId } = req.params;

  const result = await habitService.createHabit(studyId, req.body);

  res.status(201).send(result);
}

export const patchHabit = async (req, res) => {
  const { habitId } = req.params

  const result = await habitService.patchHabit(habitId, req.body)

  res.send(result)
}

export const deleteHabit = async (req, res) => {
  const { habitId } = req.params

  const result = await habitService.deleteHabit(habitId)

  res.send(result)
}
