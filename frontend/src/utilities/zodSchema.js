import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email("Enter a valid Email"),
    password: z.string().min(6, "Password should have atleast 6 characters"),
    name: z.string().min(3, "Name must have atleast 3 characters").max(32, "Name can have atmost 32 characters"),
});

export const loginSchema = z.object({
    email: z.string().email("Enter a valid Email"),
    password: z.string().min(6, "Password should have atleast 6 characters")
});