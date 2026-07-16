import { createMockUserStudies } from "../mocks/userstudyMock.js";

export const listMyStudies = async (userId) => {
    return await createMockUserStudies(userId);
}