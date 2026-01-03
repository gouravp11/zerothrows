import { BACKEND_URL } from "../config";

export const getMockUser = async (selectedUser) => {
    const res = await fetch(`${BACKEND_URL}/mock/mock-login/${selectedUser}`);
    return res;
};
