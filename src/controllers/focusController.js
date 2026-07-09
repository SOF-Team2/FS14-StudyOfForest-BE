import * as focusService from '../services/focusService.js';

export const getFocus = async (req, res) => {
  const result = await focusService.getFocus();
  res.send(result);
};

export async function updateFocusPointController(req, res, next) {
  try {
    const studyId = req.params.id;
    const { password, point } = req.body;

    const updated = await focusService.updateFocusPoint(studyId, password, point);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}