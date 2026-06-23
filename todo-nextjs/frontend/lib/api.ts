import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const backendApi = axios.create({
  baseURL: BACKEND_URL,
  timeout: 5000,
});
