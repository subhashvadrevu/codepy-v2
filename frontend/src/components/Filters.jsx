import { useThemeStore } from '@/store/useThemeStore';
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"
import { Input } from "../components/ui/input.jsx";
import { Search } from 'lucide-react';
import { useProblemStore } from '@/store/useProblemStore.js';

const Filters = ({
    problems, 
    setProblems,
    pageNo,
    setTotCount,
    probCount,
    setCurrProbLen
}) => {

    const { theme } = useThemeStore();
    const { solvedProblems } = useProblemStore();

    const tagOptions = [
    { value: "all", label: "All" },
    { value: "arrays", label: "Arrays" },
    { value: "string", label: "String" },
    { value: "hashmap", label: "Hashmap" },
    { value: "dynamic programming", label: "Dynamic Programming" },
    { value: "tree", label: "Tree" },
    { value: "graph", label: "Graph" },
    { value: "backtracking", label: "Backtracking" },
    { value: "bit manipulation", label: "Bit Manipulation" },
    { value: "two pointers", label: "Two Pointers" },
    { value: "searching", label: "Searching" },
    { value: "sorting", label: "Sorting" },
    { value: "greedy", label: "Greedy" },
    { value: "binary search", label: "Binary Search" },
    { value: "sliding window", label: "Sliding Window" },
    { value: "trie", label: "Trie" },
    { value: "stack", label: "Stack" },
    { value: "queue", label: "Queue" },
    { value: "heap", label: "Heap" },
    { value: "math", label: "Math" },
 ]

    const [tags, setTags] = useState("all");
    const [difficulty, setDifficulty] = useState("ALL");
    const [solvedStatus, setSolvedStatus] = useState("all");
    const [searchTitle, setSearchTitle] = useState("");

    const filterProblems = () => {
        let tagFiltered = problems;
        let difficultyFiltered = [];
        let statusFiltered = [];
        let searchFiltered = [];

        if(!Array.isArray(problems) || problems.length === 0) {
            setProblems([]);
            return;
        }

        setTotCount(problems.length);

        if(tags.toLowerCase() === "all") {
            tagFiltered = problems;
        }
        else {
            tagFiltered = problems.filter((problem) => problem.tags.some((problemTag) => problemTag.trim().toLowerCase() == tags.trim().toLowerCase()))
        }
            
        if(!Array.isArray(tagFiltered) || tagFiltered.length === 0) {
            setProblems([]);
            return;
        }

        if(difficulty.toLowerCase() === "all") {
            difficultyFiltered = tagFiltered;
        }
        else {
            difficultyFiltered = tagFiltered.filter((problem) => problem.difficulty === difficulty.toUpperCase())
        }
            
        if(!Array.isArray(difficultyFiltered) || difficultyFiltered.length === 0) {
            setProblems([]);
            return;
        }

        if(solvedStatus.toLowerCase() === "all") {
            statusFiltered = difficultyFiltered;
        }
        else {

            if(solvedStatus.toLowerCase() === "solved") {
                if(!Array.isArray(solvedProblems) || solvedProblems.length === 0) {
                    setProblems([]);
                    return ;
                }
                const solvedIds = new Set(solvedProblems.map(p => p.id));
                statusFiltered = difficultyFiltered.filter(problem => solvedIds.has(problem.id));
                
            }
            else if(solvedStatus.toLowerCase() === "todo") {
                let solvedIds = new Set();
                if(!Array.isArray(solvedProblems) || solvedProblems.length === 0) {
                    solvedIds = new Set();   
                }
                else {
                    solvedIds = new Set(solvedProblems.map(p => p.id));
                }
                statusFiltered = difficultyFiltered.filter(problem => !solvedIds.has(problem.id));   
            }
        }

        if(!Array.isArray(statusFiltered) ||  statusFiltered.length === 0) {
            setProblems([]);
            return;
        }

        if(searchTitle.trim() !== "") {
            searchFiltered = statusFiltered.filter((problem) => problem.title.trim().toLowerCase().includes(searchTitle.trim().toLowerCase()))
        }
        else {
            searchFiltered = statusFiltered
        } 

        if(!Array.isArray(searchFiltered) ||  searchFiltered.length === 0) {
            setProblems([]);
            return;
        }

        setCurrProbLen(searchFiltered.length);

        const pageFiltered = searchFiltered.slice(pageNo*probCount , (pageNo+1)*probCount);


        setProblems(pageFiltered);

    };

    useEffect(() => {
        filterProblems()
    },[tags, difficulty, solvedStatus, searchTitle, pageNo]);


  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value)}>
                <SelectTrigger className="w-full bg-[#f5f5f4]">
                    <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className={theme==="light"?"bg-[#f5f5f4]":""}>
                    <SelectLabel>Filter Problems By Difficulty</SelectLabel>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select value={solvedStatus} onValueChange={(value) => setSolvedStatus(value)}>
                <SelectTrigger className="w-full bg-[#f5f5f4]">
                    <SelectValue placeholder="Solved Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className={theme==="light"?"bg-[#f5f5f4]":""}>
                    <SelectLabel>Filter Problems by Solved status</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="solved">Solved</SelectItem>
                    <SelectItem value="todo">Todo</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>


            <Select value={tags} onValueChange={(value) => setTags(value)}>
                <SelectTrigger className="w-full bg-[#f5f5f4]">
                    <SelectValue placeholder="Tags" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className={theme==="light"?"bg-[#f5f5f4]":""}>
                    <SelectLabel>Filter Problems By Tags</SelectLabel>
                    {tagOptions.map((tag, index) => (
                        <SelectItem key={index} value={tag.value}>
                            {tag.label}
                        </SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className='relative w-full flex items-center'>
                <Search className='absolute left-2 w-4 h-4' />
                <Input onChange={(e) => setSearchTitle(e.target.value)} type="text" className={"pl-8 bg-[#f5f5f4]"} placeholder="Search problems" />
            </div>
        </div>
  )
}

export default Filters