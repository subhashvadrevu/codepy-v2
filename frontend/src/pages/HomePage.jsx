import ProblemTable from '@/components/ProblemTable';
import { useProblemStore } from '@/store/useProblemStore';
import { Loader } from 'lucide-react';
import React, { useEffect } from 'react'

const HomePage = () => {

  const {problems, isProblemsLoading, getAllProblems} = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if(isProblemsLoading) {
    return (
      <div className='flex items-center justify-center h-screen w-full'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <div className='mx-10 flex flex-col'>
        <p className='text-center font-semibold text-3xl sm:text-4xl md:text-5xl m-4 px-4 py-8'>
          <span className='text-[#ff6900]'>CodePy</span> Practice Sheet
        </p>

        <ProblemTable problems={problems} />

        
        
    </div>
  )
}

export default HomePage;