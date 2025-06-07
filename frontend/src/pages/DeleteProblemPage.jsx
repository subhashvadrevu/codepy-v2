import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/utilities/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProblemSchema } from "@/utilities/zodSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";


const DeleteProblemPage = () => {

    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);


    const { register, handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(deleteProblemSchema),
        defaultValues: {
        problemId: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            setIsDeleting(true);
            const res = await axiosInstance.delete(`/problems/deleteProblem/${data.problemId}`);
            console.log("del res",res);
            toast.success(res.data.message || "Problem created successfully");
            navigate("/");
        } catch (error) {
            console.log("Erro deleting problem", error);
            toast.error(error.response.data.error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-sm bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-center">Delete Problem</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <Label htmlFor="problemId" className="block mb-2 font-medium">
                        Problem ID
                    </Label>
                    <Input
                        id="problemId"
                        type="text"
                        {...register("problemId")}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
                        errors.problemId
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder="Enter problem ID"
                    />
                    {errors.problemId && (
                        <p className="mt-1 text-red-600 text-sm">{errors.problemId.message}</p>
                    )}
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={isDeleting}
                    className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                    {isSubmitting ? <div className="flex items-center gap-4"><Loader2 className="animate-spin size-5" /> {"Deleting..."}</div> : "Delete Problem"}
                </Button>
            </form>
        </Card  >
    );
};

export default DeleteProblemPage;
