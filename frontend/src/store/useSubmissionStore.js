import { axiosInstance } from "@/utilities/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useSubmissionStore = create((set) => ({
    isExecuting: false,
    submission: null,
    isLoadingSubmissions: false,
    submissionsById: null,

    submitCode: async(source_code, language_id, stdin, expected_output, problemId) => {
        try {
            set({ isExecuting: true });

            const res = await axiosInstance.post("/submit/", { source_code, language_id, stdin, expected_output, problemId });

            set({ submission: res.data.submissionWithTestCases });
            console.log(res.data);
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response.statusText || "Error submitting code... Try again");
        } finally {
            set({ isExecuting: false });
        }
    },

    getSubmissionsById: async(problemId) => {
        try {
            set({ isLoadingSubmissions: true })

            const res = await axiosInstance.get(`/submit/getSubmissions/${problemId}`);
            console.log(res.data);
            set({ submissionsById: res.data.submissionsForProblemByUser });

        } catch (error) {
            console.log("error in fetching submissions: ",error);
            toast.error("Error fetching submissions");
        } finally {
            set({ isLoadingSubmissions: false })
        }
    }

}));