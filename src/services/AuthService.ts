import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const baseURL = API_BASE_URL;

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${baseURL}/auth/login`, { email, password });
  return response.data;
};
