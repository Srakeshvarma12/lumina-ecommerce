import { apiRequest } from "../api/api";

/**
 * LOGIN
 */
export const loginUser = async (data) => {
  return await apiRequest("/users/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * REGISTER
 */
export const registerUser = async (data) => {
  return await apiRequest("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
