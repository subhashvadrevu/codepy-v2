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

        const tokensArray = submissionResponse?.map((res) => res.token);

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

        console.log("Detailed Results : \n",detailedResults);

        console.log("lang id bro : ",getLanguage(language_id))

        console.log("this is soucre code : ", source_code, typeof(source_code));

        const maxTimeArray = detailedResults.map((r) => parseFloat(r.time || "0"));
        const maxTimeValueInS = Math.max(...maxTimeArray);
        const maxTimeValueInMs = (maxTimeValueInS * 1000).toFixed(3);

        const maxMemoryArray = detailedResults.map((r) => parseFloat(r.memory || "0"));
        const maxMemoryValueInKb = Math.max(...maxMemoryArray);
        const maxMemoryValueInMb = (maxMemoryValueInKb / 1024).toFixed(3);

        const codeSubmission = await db.submission.create({
            data: {
                userId,
                problemId,
                language: getLanguage(language_id),
                sourceCode: { code: source_code },
                time: `${maxTimeValueInMs} ms`,
                memory: `${maxMemoryValueInMb} MB`,
                status: detailedResults.map((r) => r.status).join("\n"),
            }
        });

        console.log(codeSubmission)

        console.log('test message 1')

        if(accepted) {
            // upsert -> creates a record if it doesn’t exist, or updates it if it does
            await db.solvedProblems.upsert({
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

        console.log('test message 2')

        const testcaseResults = detailedResults.map((result) => ({
            submissionId: codeSubmission.id,
            testcaseNumber: result.testcase,
            accepted: result.status === "Accepted" ? true : false,
            stdin: `${result.stdin}`,
            stdout: `${result.stdout}`,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status,
            time: result.time,
            memory: result.memory,
        }));

        await db.testcaseResult.createMany({
            data: testcaseResults
        });

        console.log('test message 3')


        const submissionWithTestCases = await db.submission.findUnique({
            where: {
                id: codeSubmission.id
            },

            include: {
                testcaseResult: true
            }

        });

        console.log('test message 4')

        return res.status(200).json({
            success: true,
            message: "Code executed sucessfully",
            submissionWithTestCases
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error submitting code"
        });
    }
};


export const runCode = async(req, res) => {
    const { source_code, language_id, stdin, expected_output, problemId } = req.body;

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

        const tokensArray = submissionResponse?.map((res) => res.token);

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

        console.log("Detailed Results : \n",detailedResults);

        console.log("lang id bro : ",getLanguage(language_id))

        console.log("this is soucre code : ", source_code, typeof(source_code));

        const maxTimeArray = detailedResults.map((r) => parseFloat(r.time || "0"));
        const maxTimeValueInS = Math.max(...maxTimeArray);
        const maxTimeValueInMs = (maxTimeValueInS * 1000).toFixed(3);

        const maxMemoryArray = detailedResults.map((r) => parseFloat(r.memory || "0"));
        const maxMemoryValueInKb = Math.max(...maxMemoryArray);
        const maxMemoryValueInMb = (maxMemoryValueInKb / 1024).toFixed(3);


        const testcaseResults = detailedResults.map((result) => ({
            testcaseNumber: result.testcase,
            accepted: result.status === "Accepted" ? true : false,
            stdin: `${result.stdin}`,
            stdout: `${result.stdout}`,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status,
            time: result.time,
            memory: result.memory,
        }));


        return res.status(200).json({
            success: true,
            message: "Code executed sucessfully",
            testcaseResults
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error submitting code"
        });
    }
};


export const getAllSubmissionsByUser = async(req, res) => {
    const userId = req.user.id;
    try {
        const submissionsByUser = await db.submission.findMany({
            where: {
                userId
            }
        });

        return res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissionsByUser
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


export const getSubmissionsCountForProblemByAllUsers = async(req, res) => {
    const problemId = req.params.id;

    try {
        const submissionsCountForProblemByAllUsers = await db.submission.count({
            where: {
                problemId
            }
        });

        return res.status(200).json({
            success: true,
            message: "Submissions count fetched successfully",
            count: submissionsCountForProblemByAllUsers
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error fetching total submission count for a problem by all users"
        });
    }
};

export const getTotalSubmissionsCountByUser = async(req, res) => {
    const username = req.params.username;

    try {

        const user = await db.user.findUnique({
            where: {
                username
            }
        });

        if(!user) {
            return res.status(404).json({
                error: "no user with given username"
            });
        }


        const totalSubmissionsCountByUser = await db.submission.count({
            where: {
                userId: user.id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Submissions count fetched successfully",
            count: totalSubmissionsCountByUser
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error fetching total submissions count by a user"
        });
    }
};