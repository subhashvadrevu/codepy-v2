import { createBatchSubmission, getBatchSubmissionResult } from "../utilities/judge0.utility.js";

export const submitCode = async(req, res) => {
    const { source_code, language_id, stdin, expected_output, problemId } = req.body;

    const userId = req.user.id;

    try {
        if(
            !Array.isArray(stdin) ||
            stdin.length === 0 || 
            !Array.isArray(expected_output) || 
            expected_output.length === 0 
        ) {
            return res.status(400).json({
                error: "Invalid or Missing Testcases"
            });
        }
        
        const submissions = stdin.map((input, ind) => ({
            source_code,
            language_id,
            stdin: input,
            expected_output: expected_output[ind]
        }));

        const submissionResponse = await createBatchSubmission(submissions);

        const tokensArray = submissionResponse.map((res) => res.token);

        const results = await getBatchSubmissionResult(tokensArray);

        console.log("Results : \n", results);

        return res.status(200).json({
            success: true,
            message: "Code executed sucessfully",
            results
        });

    } catch (error) {
        return res.status(500).json({
            error: "Error submitting code"
        });
    }
};