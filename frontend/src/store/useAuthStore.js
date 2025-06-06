import { create } from "zustand";
import { axiosInstance } from "@/utilities/axios";
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
    authenticatedUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,
    isDeletingAccount: false,


    checkAuth: async() => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/me");
            console.log("check auth res : ", res.data);
            sessionStorage.setItem("role", res.data.user.role);
            set({ authenticatedUser: res.data.user });
        } catch (error) {
            console.log("error checking auth: ",error);
            set({ authenticatedUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async(data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/register", data);

            set({ authenticatedUser: res.data.user });

            toast.success(res.data.message);
        } catch (error) {
            console.log("error signing up : ", error);
            toast.error(error.response.data.error);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async(data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);

            set({ authenticatedUser: res.data.user });
            sessionStorage.setItem("role", res.data.user.role);

            toast.success(res.data.message);
        } catch (error) {
            console.log("error logging in : ", error);
            toast.error(error.response.data.error);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authenticatedUser: null });
            sessionStorage.removeItem("role");
            toast.success("Logout successful");
        } catch (error) {
            console.log("Error logging out: ", error);
            toast.error(error.response.data.error);
        }
    },

    deleteAccount: async() => {
        set({ isDeletingAccount: true });
        try {
            await axiosInstance.delete("/auth/delete");
            set({ authenticatedUser: null });
            sessionStorage.removeItem("role");  
            toast.success("Account deleted successfully");
        } catch (error) {
            console.log("Error deleting account: ", error);
            toast.error(error.response.data.error);
        } finally {
            set({ isDeletingAccount: false });
        }
    },
}));