import { UserRole } from "../generated/prisma/index.js";
import { db } from "../libs/db.js";
import { createBatchSubmission, getBatchSubmissionResult, getJudge0Id } from "../utilities/judge0.utility.js";

export const createProblem = async(req, res) => {
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body;

    if(req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({
            error: "Access denied"
        });
    }

    try {
        for(const [language, solution] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0Id(language);

            if(!languageId) {
                return res.status(400).json({
                    error: `Language ${language} not supported`
                });
            }

            const submissions = testcases.map(({ input, output }) => {
                return {
                    source_code: solution,
                    language_id: languageId,
                    stdin: input,
                    expected_output: output
                }
            });

            const tokens = await createBatchSubmission(submissions);
            if(!tokens) {
                return res.status(500).json({
                    error: "Internal server error"
                });
            }

            const tokensArray = tokens.map(({ token }) => token);
            const batchSubmissionResult = await getBatchSubmissionResult(tokensArray);
            
            for(let i = 0; i < batchSubmissionResult.length; i++) {
                const result = batchSubmissionResult[i];
                console.log(`Result ${i} : `, result);

                if(result.status_id !== 3) {
                    return res.status(400).json({
                        error: `Testcase ${i} - ${result.status_id} for language: ${language}, stderr: ${result.stderr}`
                    });
                }
            }

            const newProblem = await db.problem.create({
                data: {
                    title, 
                    description, 
                    difficulty, 
                    tags, 
                    userId: req.user.id,
                    examples, 
                    constraints, 
                    testcases, 
                    codeSnippets, 
                    referenceSolutions
                }
            });

            return res.status(201).json({
                success: true, 
                message: "Problem created successfully",
                problem: newProblem
            });
            
        }
    } catch (error) {
        console.log("Error while creating new problem: ", error);
        return res.status(500).json({
            error: "Error creating new problem"
        });
    }

}; 

export const getAllProblems = async(req, res) => {
    try {
        const problems = await db.problem.findMany();

        if(!problems) {
            return res.status(404).json({
                error: "No problems found"
            });
        }

        return res.status(201).json({
            success: true, 
            message: "Problem fetched successfully",
            problems
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while fetching problems"
        });
    }
};

export const getProblemByName = async(req, res) => {
    const { name } = req.params;

    try {
        const problem = await db.problem.findUnique({
            where: {
                name: name
            }
        });

        if(!problem) {
            return res.status(404).json({
                error: "Problem not found"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Problem fetched successfully",
            problem
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error fetching problem with given name"
        });
    }
};

export const updateProblem = async(req, res) => {
    const { name } = req.params;
    const { newTitle, newDescription, newDifficulty, newTags, newExamples, newConstraints, newTestcases, newCodeSnippets, newReferenceSolutions } = req.body;

    try {
        const problem = await db.problem.findUnique({
            where: {
                name: name
            }
        });

        if(!problem) {
            return res.status(404).json({
                error: "Proble not found"
            });
        }

        const updateData = {
            ...(!newTitle && {title: newTitle}),
            ...(!newDescription && {description: newDescription}),
            ...(!newDifficulty && {difficulty: newDifficulty}), 
            ...(!newTags && {tags: newTags}),
            ...(!newExamples && {examples: newExamples}),
            ...(!newConstraints && {constraints: newConstraints}),
            ...(!newTestcases && {testcases: newTestcases}),
            ...(!newCodeSnippets && {codeSnippets: newCodeSnippets}),
            ...(!newReferenceSolutions && {referenceSolutions: newReferenceSolutions})
        }

        const updatedProblem = await db.problem.update({
            where: {
                name: name
            },
            data: {
                updateData
            }
        });

        if(!updatedProblem) {
            return res.status(500).json({
                error: "Error updating problem"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Problem updated successfully",
            updatedProblem
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error updating problem"
        });
    }
};

export const deleteProblem = async(req, res) => {
    const { name } = req.params;

    try {
        const problem = await db.problem.findUnique({
            where: {
                name
            }
        }); 

        if(!problem) {
            return res.status(404).json({
                error: "Problem not found"
            });
        }

        const deletedProblem = await db.problem.delete({
            where: {
                name
            }
        });

        if(!deletedProblem) {
            return res.status(500).json({
                error: "Error deleting problem"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Problem deleted successfully",
            deletedProblem
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error deleting problem"
        });
    }
};

export const getSolvedProblemsByUser = async(req, res) => {

};