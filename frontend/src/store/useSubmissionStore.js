import { axiosInstance } from "@/utilities/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useSubmissionStore = create((set) => ({
    isExecuting: false,
    submission: null,
    isLoadingSubmissions: false,
    submissionsById: null,
    isLoadingAllSubmissions: false,
    allSubmissions: null,
    isFetchingCount: false,
    submissionsCount: null,

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
    },

    getAllSubmissions: async() => {
        try {
            set({ isLoadingAllSubmissions: true });
            
            const res = await axiosInstance.get("/submit/getAllSubmissions");
            console.log("all submissions: ", res.data);

            set({ allSubmissions: res.data.submissionsByUser });

            // toast.success(res.data.message);

        } catch (error) {
            console.log("error fetching all submissions : ",error);
            toast.error("Error fetching all submissions");
        } finally {
            set({ isLoadingAllSubmissions: false });
        }
    },

    getSubmissionsCountByUser: async(username) => {
        try {
            set({ isFetchingCount: true });

            const res = await axiosInstance.get(`/submit/getTotalSubmissionsByUser/${username}`);
            console.log("count sub: ", res.data);

            set({ submissionsCount: res.data.count });

            // toast.success(res.data.message);

        } catch (error) {
            console.log("error fetching count: ", error);
            // toast.error("Error fetching submission count");

        } finally {
            set({ isFetchingCount: false });
        }
    },

}));