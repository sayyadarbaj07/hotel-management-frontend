import axiosInstance from "./axios";

export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};
