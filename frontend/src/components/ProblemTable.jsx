import React, { useEffect, useState } from 'react'
import Filters from './Filters'
import { Link, useNavigate } from 'react-router-dom';
import { useProblemStore } from '@/store/useProblemStore';
import { BadgeCheck } from 'lucide-react';
import { PaginationEx } from './Pagination';

const ProblemTable = (props) => {

    const {solvedProblems, getSolvedProblemsByUser} = useProblemStore();
    const [problems, setProblems] = useState(props.problems);
    const [pageNo, setPageNo] = useState(0);
    const [totCount, setTotCount] = useState(0);
    const [currProbLen, setCurrProbLen] = useState(0);
    const probCount = 5;

    const navigate = useNavigate();

    useEffect(() => {
        getSolvedProblemsByUser();
    }, [getSolvedProblemsByUser]);

    const inSolvedProblems = (problemId) => {
        if(!solvedProblems) {
            return false;
        }
        
        const inSolved = solvedProblems.some((problem) => problem.id === problemId)
        
        if(!inSolved)
            return false;
        else
            return true;
    }

  return (
    <div className='w-full flex flex-col gap-6'>
        <Filters problems={props.problems} setProblems={setProblems} pageNo={pageNo} setTotCount={setTotCount} probCount={probCount} setCurrProbLen={setCurrProbLen}  />


        <table className='w-full bg-[#ececec] dark:bg-[#18181b] flex flex-col gap-3 dark:border-2 border-border rounded-md p-3'>
            <thead>
                <tr className='grid grid-cols-12 gap-2'>
                    <th className='col-span-2 text-center text-lg text-white p-3 bg-[#ff6900]'>S.No</th>
                    <th className='col-span-8 text-center text-lg text-white p-3 bg-[#ff6900]'>Title</th>
                    <th className='col-span-2 text-center text-lg text-white p-3 bg-[#ff6900] text-nowrap'>Level</th>
                </tr>
            </thead>
            <tbody className='flex flex-col gap-2'>
                {
                    Array.isArray(problems) && problems.length > 0 ?
                    problems.map((problem, index) => (
                        <tr key={problem.id || index} className='grid grid-cols-12 gap-2'>
                            <td className='col-span-2 text-center p-3 bg-white dark:bg-[#27272a]'>{pageNo*probCount + index +1}</td>
                            <td className='col-span-8 text-center p-3 bg-white dark:bg-[#27272a] hover:cursor-pointer' onClick={() => navigate(`/problem/${problem.id}`)}>{problem.title}</td>
                            <td className={`col-span-2 text-center p-3 bg-white dark:bg-[#27272a] font-semibold dark:font-normal font-mono ${problem.difficulty === "EASY" && "text-[#2cbb52]"} ${problem.difficulty === "MEDIUM" && "text-[#fcb700]"} ${problem.difficulty === "HARD" && "text-[#ff6467]"}`}>{problem.difficulty.slice(0,1) + problem.difficulty.toLowerCase().slice(1)}</td>
                        </tr>
                    ))
                    :
                    <tr className='flex items-center justify-center dark:text-white'>
                        <td className='text-center'>😞 No problems found</td>
                    </tr>
                }  
            </tbody>
        </table>

        <PaginationEx pageNo={pageNo} setPageNo={setPageNo} maxLimit={Math.ceil(totCount/probCount)} currentFetchedProblemsCount={problems.length || 0} currProbLen={currProbLen} />
    </div>
  )
}

export default ProblemTable