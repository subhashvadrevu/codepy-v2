import { create } from "zustand";
import { axiosInstance } from "@/utilities/axios";
import toast from "react-hot-toast"; 


export const useProblemStore = create((set) => ({
    problems: [],
    problem: null,
    solvedProblems: [],
    isProblemsLoading: false,
    isProblemLoading: false,

    getAllProblems: async() => {
        try {
            set({ isProblemsLoading: true });

            const res = await axiosInstance.get("/problems/getAllProblems");
            console.log("fetched all problems : ", res.data);

            set({ problems: res.data.problems });

        } catch (error) {
            console.log("error fetching all problems : ", error);
            toast.error("Error fetching problems");
        } finally {
            set({ isProblemsLoading: false });
        }
    },

    getProblemById: async(id) => {
        try {
            set({ isProblemLoading: true });

            const res = await axiosInstance.get(`/problems/getProblem/${id}`);
            console.log("fetched problem: ", res.data);

            set({ problem: res.data.problem });


        } catch (error) {
            console.log("error fetching problem :", error);
            toast.error("Error fetching problem with given id");
        } finally {
            set({ isProblemLoading: false });
        }
    },

    getSolvedProblemsByUser: async() => {
        try {
            const res = await axiosInstance.get("/problems/getSolvedProblems");
            console.log("solved problems of user: ", res.data);

            set({ solvedProblems: res.data.solvedProblemsByUser });

            // toast.success("Solved problems fetched successfully");

        } catch (error) {
            console.log("Error fetching solved problems by user: ", error);
            toast.error("Error fetching solved problems by user");
        }
    },

    getProblemByIdWithData: async(id) => {
        try {
            set({ isProblemLoading: true });

            const res = await axiosInstance.get(`/problems/getProblem/${id}`);
            console.log("fetched problem: ", res.data);

            return res.data.problem;


        } catch (error) {
            console.log("error fetching problem :", error);
            toast.error("Error fetching problem with given id");
        } finally {
            set({ isProblemLoading: false });
        }
    },

}));