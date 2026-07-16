import { createMockDashboard } from "../mocks/dashboardMock.js";

export const getDashboard = async (userId) => {
    return await createMockDashboard(userId);
}