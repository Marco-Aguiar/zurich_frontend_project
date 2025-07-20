export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Variable REACT_APP_API_BASE_URL is not defined in your .env file.");
}
