import axios from "axios";

export const getJudge0Id = (language) => {
    const judge0Id = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
        "CPP": 54
    };

    return judge0Id[language.toUpperCase()]
};

export const createBatchSubmission = async(submissionsData) => {
    try {
        const result = await axios.post(
            `${process.env.JUDGE0_BASE_URL}/submissions/batch?base64_encoded=false`,
            { submissionsData }
        );

        console.log("Submission Result :",result.data);

        return result.data;

    } catch (error) {
        console.log("Error creating submission :", error);
        return null;
    }
};

export const getBatchSubmissionResult = async(tokensArray) => {
    
    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    try {

        do {
            const result = await axios.get(
                `${process.env.JUDGE0_BASE_URL}/submissions/batch?tokens=${tokensArray.join(",")}&base64_encoded=false`
            );

            const submissionResults = result.submissions;
            
            const allExecuted = submissionResults.every(
                (res) => res.status_id !== 1 && res.status_id !== 2
            );

            if(allExecuted) {
                return submissionResults;
            }

            await sleep(1000);

        } while (!allExecuted);


    } catch (error) {
        console.log("Batch submission error: ", error);
        return null;
    }
};