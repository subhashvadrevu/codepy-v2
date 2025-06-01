import { db } from "../libs/db.js";

export const createList = async(req, res) => {
    const userId = req.user.id;
    const { name, description } = req.body;

    const existingList = await db.list.findUnique({
        where: {
            name
        }
    });

    if(existingList) {
        return res.status(400).json({
            error: "List already exists"
        });
    }

    try {
        const list = await db.list.create({
            data: {
                name,
                description,
                userId
            }
        });

        if(!list) {
            return res.status(500).json({
                error: "Error creating a list"
            });
        }

        return res.status(200).json({
            success: true,
            message: "List created successfully",
            list
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error creating a list"
        });
    }
};

export const addProblemToList = async(req, res) => {
    const listId = req.params.id;
    const { problemId } = req.body;

    try {

        const existingProblem = await db.problemsinList.findUnique({
            where: { 
                listId_problemId: {
                    listId,
                    problemId
                }
            }
        });

        if(existingProblem) {
            return res.status(400).json({
                error: "Problem is already in list"
            });
        }


        const addedProblem = await db.problemsinList.create({
            data: {
                listId,
                problemId
            }
        });

        if(!addedProblem) {
            return res.status(500).json({
                error: "Error adding problem to list"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem added successfully to list",
            addedProblem
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error adding problem/problems to list"
        });
    }

};

export const deleteList = async(req, res) => {
    const listId = req.params.id;

    try {
        const deletedList = await db.list.delete({
            where: {
                id: listId
            }
        });

        if(!deletedList) {
            return res.status(500).json({
                error: "Error deleting list"
            });
        }

        return res.status(200).json({
            success: true,
            message: "List deleted successfully",
            deletedList
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error deleting list"
        });
    }

};

export const removeProblemFromList = async(req, res) => {
    const listId = req.params.id;
    const problemId = req.body.problemId;

    try {

        const existingProblem = await db.problemsinList.findUnique({
            where: {
                listId_problemId: {
                    listId,
                    problemId
                }
            }
        });

        if(!existingProblem) {
            return res.status(400).json({
                error: "Problem doesnot exist"
            });
        }

        const removedProblem = await db.problemsinList.delete({
            where: {
                listId_problemId: {
                    listId,
                    problemId
                }
            } 
            
        });

        if(!removedProblem) {
            return res.status(500).json({
                error: "Error removing problem/problems from list"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Problem removed successfully from List",
            removedProblem
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error removing problem/problems from list"
        });
    }
};

export const getAllListDetails = async(req, res) => {
    const userId = req.user.id;
    try {
        const lists = await db.list.findMany({
            where: {
                userId
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        });

        if(!lists) {
            return res.status(404).json({
                error: "No List not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lists fetched successfully",
            lists
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error fetching lists"
        });
    }
};

export const getListById = async(req, res) => {
    const listId = req.params.id;
    const userId = req.user.id;

    try {
        const listWithId = await db.list.findUnique({
            where: {
                id: listId,
                userId
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        });

        if(!listWithId) {
            return res.status(404).json({
                error: "List not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "List fetched successfully",
            listWithId 
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error fetching list"
        });
    }
};