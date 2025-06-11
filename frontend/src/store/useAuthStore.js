import { create } from "zustand";
import { axiosInstance } from "@/utilities/axios";
import toast from "react-hot-toast";


export const useAuthStore = create((set, get) => ({
    authenticatedUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,
    isDeletingAccount: false,
    isVerifying: false,
    isGenerating: false,


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
            toast.error(error.response.data.error || "Error logging in");
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
            toast.error(error);
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

    generateOtp: async() => {
        try {
            set({ isGenerating: true });
            const res = await axiosInstance.patch("/auth/generateOtp");
            console.log("otp gen: ", res);
            toast.success(res.data.message);
        } catch (error) {
            console.log('otp gen err: ', error);
            toast.error(error.response.data.error || "Error generating OTP");
        } finally { 
            set({ isGenerating: false });
        }
    },

    verifyEmail: async(data) => {
        try {
        
            set({ isVerifying: true });

            const res = await axiosInstance.post("/auth/verifyOtp", data);
            const updatedUser = {
                ...get().authenticatedUser,
                isVerified: true
            };  
            set({ authenticatedUser: updatedUser });

            console.log("verify otp res:", res);
            toast.success(res.data.message);
            

        } catch (error) {
            console.log("error in email verify : ", error);
            toast.error(error.response.data.error || "Error verifying email");
        } finally {
            set({ isVerifying: false });
        }
    },
}));