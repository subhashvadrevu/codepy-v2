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


export const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  constraints: z.string().min(1, "Constraints are required"),
  tags: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ).min(1, "Atleast one tag must be selected"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        // explantion: z.string().min(1, "Explantion is required"),
      })
    )
    .min(1, "At least one test case is required"),
  codeSnippets: z.object({
    // JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    // JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    // JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python refernce solution is required"),
    // JAVA: z.string().min(1, "Java solution is required"),
  }),
});


export const deleteProblemSchema = z.object({
  problemId: z.string().min(1, "Problem ID is required"),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(6, "Invalid OTP"),
});
