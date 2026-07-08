import * as habitService from '../services/habitService.js';

export const getHabits = async (req, res) => {
    const result = await habitService.getHabits();

    res.send(result);
};