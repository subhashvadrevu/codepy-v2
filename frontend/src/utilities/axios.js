import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:  "http://localhost:5555/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }

});