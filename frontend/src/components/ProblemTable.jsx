import React, { useEffect, useState } from 'react'
import Filters from './Filters'
import { Link } from 'react-router-dom';
import { useProblemStore } from '@/store/useProblemStore';
import { BadgeCheck } from 'lucide-react';

const ProblemTable = (props) => {

    const {solvedProblems, getSolvedProblemsByUser} = useProblemStore();
    const [problems, setProblems] = useState(props.problems);

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
        <Filters problems={props.problems} setProblems={setProblems}  />


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
                        <tr key={problem.id || index}    className='grid grid-cols-12 gap-2'>
                            <td className='col-span-2 text-center p-3 bg-white dark:bg-[#27272a]'>{index+1}</td>
                            <td className='col-span-8 text-center p-3 bg-white dark:bg-[#27272a]'>{problem.title}</td>
                            <td className='col-span-2 text-center p-3 bg-white dark:bg-[#27272a]'>{problem.difficulty.slice(0,1) + problem.difficulty.toLowerCase().slice(1)}</td>
                        </tr>
                    ))
                    :
                    <tr className='flex items-center justify-center dark:text-white'>
                        <td className='text-center'>No problem found</td>
                    </tr>
                }  
            </tbody>
        </table>


    </div>
  )
}

export default ProblemTable