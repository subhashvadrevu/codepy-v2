import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://codepy-v2.onrender.com/", 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }

});