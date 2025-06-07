import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5555/api/v1" : "https://codepy-v2-backend.onrender.com/api/v1",
    withCredentials: true
});