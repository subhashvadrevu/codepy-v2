import { createBatchSubmission, getBatchSubmissionResult, getLanguage } from "../utilities/judge0.utility.js";
import { db } from "../libs/db.js";

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


        let accepted = true;
        const detailedResults = results.map((result, index) => {
            const status = result.status.description;

            if(status.toLowerCase() !== "accepted") {
                accepted = false;
            }

            return {
                testcase: index+1,
                status,
                stdin: stdin[index],
                stdout: result.stdout,
                expected_output: expected_output[index],
                stderr: result.stderr || null,
                compile_output: result.compile_output || null,
                memory: result.memory ? `${result.memory} KB` : undefined,
                time: result.time ? `${result.time} s` : undefined
            }
        });

        console.log(detailedResults);

        const codeSubmission = await db.submission.create({
            data: {
                userId,
                problemId,
                language: getLanguage(language_id),
                source_code,
                time: "Dont know",
                memory: "Dont know",
                status: detailedResults.map((r) => r.status).join("\n"),
            }
        });

        if(accepted) {
            // upsert -> creates a record if it doesn’t exist, or updates it if it does
            await db.user.solvedProblems.upsert({
                where: {
                    userId_problemId: {
                        userId,
                        problemId
                    }
                },
                update: {},
                create: {
                    userId,
                    problemId
                }
            });
        }

        const testCaseResults = detailedResults.map((result) => ({
            submissionId: codeSubmission.id,
            testCaseNumber: result.testcase,
            accepted: result.status === "Accepted" ? true : false,
            stdin: result.stdin,
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            status: result.status,
            time: result.time,
            memory: result.memory,
        }));

        await db.testCaseResult.createMany({
            data: testCaseResults
        });


        const submissionWithTestCases = await db.submission.findUnique({
            where: {
                id: codeSubmission.id
            },

            include: {
                testCaseResult: true
            }

        });

        return res.status(200).json({
            success: true,
            message: "Code executed sucessfully",
            submissionWithTestCases
        });

    } catch (error) {
        return res.status(500).json({
            error: "Error submitting code"
        });
    }
};


export const getAllSubmissions = async(req, res) => {
    const userId = req.user.id;
    try {
        const submissionByUser = await db.submission.findMany({
            where: {
                userId
            }
        });

        return res.json(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissionByUser
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error fetching submissions"
        });
    }
};


export const getSubmissions = async(req, res) => {
    const problemId = req.params.id;
    const userId = req.user.id;

    try {
        const submissionsForProblemByUser = await db.submission.findMany({
            where: {
                userId,
                problemId
            }
        });

        return res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissionsForProblemByUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error fetching submissions"
        });
    }
};


export const getSubmissionsCount = async(req, res) => {
    const problemId = req.params.id;

    try {
        const submissionsCountForProblem = await db.submission.count({
            where: {
                problemId
            }
        });

        return res.status(200).json({
            success: true,
            message: "Submission count fetched successfully",
            count: submissionsCountForProblem
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error fetching total submission count"
        });
    }
};