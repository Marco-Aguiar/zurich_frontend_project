import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const USER_URL = `${API_BASE_URL}/users`;

export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${USER_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await axios.post(USER_URL, {
    username,
    email,
    password,
  });
  return response.data;
};
