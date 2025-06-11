import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:  "https://codepy-v2-backend.onrender.com/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }

});