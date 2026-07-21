import { getDashboard } from "./src/services/dashboardService.js";

const TEST_USER_ID = "f84a713d-b50c-4571-8a56-ed98e6b32aa2";

const result = await getDashboard(TEST_USER_ID);
console.log(JSON.stringify(result, null, 2));
