import * as habitService from '../services/habitService.js';

export const getHabits = (req, res) => {
  res.json({ message: "습관 홈화면" });
}
