import { TabsDemo } from '@/components/ProblemPageTabs';
import { Button } from '@/components/ui/button';
import { useProblemStore } from '@/store/useProblemStore';
import { Editor } from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader, Loader2 } from 'lucide-react';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { getLangId } from '@/utilities/getLanguage';

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [selectedLang, setSelectedLang] = useState('python');
  const [bookmarked, setBookmarked] = useState(false);
  const [expOut, setExpOut] = useState(problem?.testcases.slice(0,3).map(({input, output}) => output) || []);

  useEffect(() => {
    getProblemById(id);
  }, [id]);

  useEffect(() => {
    setCode(problem?.codeSnippets?.[selectedLang.toUpperCase()] || '');
  }, [problem, selectedLang]);


  const { submitCode, isExecuting, submission, isLoadingSubmissions, submissionsById, getSubmissionsById } = useSubmissionStore();

  const [isRunCode, setIsRunCode] = useState(true);

  const handleRunCode = async() => {

    setIsRunCode(true);

    const languageId = getLangId(selectedLang.toUpperCase());
    const stdin = problem.testcases.slice(0,3).map(({input, output}) => input);
    const exp_out = problem.testcases.slice(0,3).map(({input, output}) => output);
    const id = problem.id;
    console.log("endayya idi:",code, languageId, stdin, exp_out, id);
    await submitCode(code, languageId, stdin, exp_out, id);
    setActiveTab("result");
    setExpOut(exp_out);
  };
  const handleSubmitCode = async() => {

    setIsRunCode(false);

    const languageId = getLangId(selectedLang.toUpperCase());
    const stdin = problem.testcases.map(({input, output}) => input);
    const exp_out = problem.testcases.map(({input, output}) => output);
    const id = problem.id;
    console.log("endayya idi submit:",code, languageId, stdin, exp_out, id);
    await submitCode(code, languageId, stdin, exp_out, id);
    setActiveTab("result");
    setExpOut(exp_out);
  };

  useEffect(() => {
    getSubmissionsById(problem?.id);
  }, [problem])


  if(isProblemLoading || !problem) {
     return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader className="animate-spin size-10" />
      </div>
     )
  }

  return (
    <div className="w-full h-[100dvh] p-2 flex flex-col lg:flex-row gap-2 overflow-visible dark:bg-black">
      
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-white dark:bg-zinc-900 rounded-xl shadow-md py-4 overflow-hidden">
        <TabsDemo
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          problem={problem}
          bookmarked={bookmarked}
          setBookmarked={setBookmarked}
          submission={submission}
          expOut={expOut}
          submissions={submissionsById}
          isLoadingSubmissions={isLoadingSubmissions}
          isRunCode={isRunCode}
        />
      </div>


      <div className="w-full lg:w-1/2 h-1/2 lg:h-full rounded-t-xl shadow-md flex flex-col">
        <div className='flex items-center justify-between gap-2 p-2 bg-gray-100 dark:bg-zinc-800 rounded-t-xl'>
          {!isExecuting 
            ?
            <div className='space-x-2'>
              <Button onClick={handleRunCode} variant={"secondary"}>Run</Button>
              <Button onClick={handleSubmitCode}>Submit</Button>
            </div>
            :
            <Button disabled>
              <Loader2 className='animate-spin w-5 h-5' />
              Submitting ...
            </Button>
          }
          <Select value={selectedLang} onValueChange={(value) => {setSelectedLang(value)}}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">Javascript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Editor
          className="rounded-b-xl overflow-hidden"
          height="100%"
          defaultLanguage={selectedLang}
          defaultValue=''
          value={code}
          theme="vs-dark"
          onChange={(val) => setCode(val || '')}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontFamily: "Fira Code, monospace",
            tabSize: 2,
            lineNumbers: "on",
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  );
};

export default ProblemPage;
