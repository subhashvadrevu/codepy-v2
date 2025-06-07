import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/store/useAuthStore';
import { useProblemStore } from '@/store/useProblemStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Clock, Loader, MemoryStick } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Tooltip } from 'react-tooltip'
import { Navigate, useNavigate } from 'react-router-dom';
import { formatDate, relativeTime } from '@/utilities/time';

const ProfilePage = () => {

  const { isLoadingAllSubmissions, allSubmissions, isFetchingCount, submissionsCount, getAllSubmissions, getSubmissionsCountByUser  } = useSubmissionStore();
  const { authenticatedUser, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const { problems, getAllProblems, solvedProblems, getSolvedProblemsByUser } = useProblemStore();

  const navigate = useNavigate();


  useEffect(() => {
    checkAuth();
    getAllSubmissions();
  }, []);

  useEffect(() => {
    getSubmissionsCountByUser(authenticatedUser?.username);
  }, [authenticatedUser]);

  useEffect(() => {
    getAllProblems();
    getSolvedProblemsByUser();
  }, []);

  if(isLoadingAllSubmissions || isFetchingCount || !allSubmissions || !problems || !solvedProblems) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader className="animate-spin size-10" />
      </div>
    )
  }

  const heatmapData = allSubmissions?.reduce((newObj,sub) => {
    const date = new Date(sub.createdAt).toISOString().split('T')[0];
    newObj[date] = (newObj[date] || 0) + 1;
    return newObj
  }, {});



  return (
    <div>
        { isLoadingAllSubmissions || isFetchingCount || !allSubmissions || !problems || !solvedProblems
          ?
            <div className="flex justify-center items-center h-screen w-full">
              <Loader className="animate-spin size-10" />
            </div> 
          :
            <div className='p-8 bg-white dark:bg-black flex flex-col gap-4'>
              <div className="flex flex-col md:flex-row items-stretch gap-4 w-full">


                
                <Card className="p-4 flex flex-col items-center justify-center w-full md:w-1/4 dark:bg-[#18181a]">
                  <h3 className="font-semibold text-lg mb-4">Solved Problems</h3>
                  <div className="w-32 h-32 ">
                    <CircularProgressbar
                      value={(solvedProblems.length / problems.length) * 100}
                      text={`${solvedProblems.length}/${problems.length}`}
                      styles={buildStyles({
                        textColor: theme === 'dark' ? '#fff' : '#000',
                        pathColor: '#2cbb52',
                        trailColor: '#dcdcdc',
                      })}
                    />
                  </div>
                </Card>

                <Card className="p-4 w-full md:w-3/4 bg-white dark:bg-[#18181a]">
                  <h3 className="text-lg font-semibold mb-4">Submission Heatmap</h3>
                  <div className="[&_.react-calendar-heatmap-weekday-label]:text-xs">
                    <CalendarHeatmap
                      className="w-full h-[100px] md:h-[120px]"
                      startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                      endDate={new Date()}
                      values={Object.entries(heatmapData).map(([date, count]) => ({
                        date, count
                      }))}
                      classForValue={(value) => {
                        if (!value) return 'fill-[#ececec] dark:fill-[#353535]';
                        if (value.count > 60) return 'fill-green-900';
                        if (value.count > 50) return 'fill-green-800';
                        if (value.count > 40) return 'fill-green-700';
                        if (value.count > 30) return 'fill-green-600';
                        if (value.count > 20) return 'fill-green-500';
                        if (value.count > 10) return 'fill-green-400';
                        if (value.count > 0) return 'fill-green-300';
                        return 'fill-green-900';
                      }}
                      tooltipDataAttrs={(value) => {
                        if (!value || !value.date) return {};
                        return {
                          'data-tooltip-id': 'submission-tooltip',
                          'data-tooltip-content': `${value.date}: ${value.count} submissions`
                        };
                      }}
                      showWeekdayLabels
                    />
                    <Tooltip id="submission-tooltip" />
                  </div>
                </Card>

              </div>


              <ScrollArea className="h-full w-full bg-wite dark:bg-[#18181a] dark:shadow-2xl">
                <div className='sm:border sm:border-border rounded-lg sm:p-5 md:p-10'>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold mb-4">Your Submissions</h2>
                  <h2 className="text-muted-foreground mb-4 hover:cursor-pointer" onClick={() => navigate("/viewAllSubmissions")}>View All Submissions</h2>
                </div>
                  {!allSubmissions || allSubmissions.length === 0 ? (
                    <p className="text-muted-foreground">You don't have any submissions yet. Refresh to fetch (if any).</p>
                  ) : (
                    <div className="space-y-4">
                      {allSubmissions.slice().reverse().slice(0,20).map((sub, index) => (
                        <div key={index} className={`hover:cursor-pointer border p-4 rounded-md bg-[#f5f5f4] dark:bg-[#27272a]`}>  
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className='grid grid-cols-12 items-center justify-between text-sm md:text-md'>
                                <p className="col-span-4 whitespace-pre-wrap break-words">{problems.find((p) => String(p.id) === String(sub.problemId))?.title || `Problem ${sub.problemId}`}</p>
                                <Badge className={"col-span-2"} >{sub.language === "Javascript" ? "JS" : sub.language}</Badge>
                                <Badge className={`col-span-2 ${sub.status.split("\n").every((res) => res.toLowerCase() === "accepted") ? "bg-[#2cbb52]" : "bg-[#ef4743]"}`} >{sub.status.split("\n").every((res) => res.toLowerCase() === "accepted") ? "Accepted" : sub.status.split("\n").slice(-1) == "Runtime Error (NZEC)" ? "Runtime Error" : sub.status.split("\n").slice(-1) }</Badge>
                                <p className="col-span-4 text-end">{relativeTime(sub.createdAt)}</p>   
                              </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className={`text-start ${sub.status.split("\n").every((res) => res.toLowerCase() === "accepted") ? "text-[#2cbb52]" : "text-[#ef4743]"}`}>
                                  {sub.status.split("\n").every((res) => res.toLowerCase() === "accepted") ? "Accepted" : sub.status.split("\n").slice(-1) == "Runtime Error (NZEC)" ? "Runtime Error" : sub.status.split("\n").slice(-1) }
                                </DialogTitle>
                                <DialogDescription className={"flex flex-col gap-2"}>
                                  <div className='flex items-center gap-2 py-2'>
                                    <img
                                      src={authenticatedUser.avatar || "https://avatar.iran.liara.run/public/boy"}
                                      alt="User"
                                      className="w-5 h-5 rounded-full border border-border object-cover"
                                    />
                                    <span className="text-black dark:text-white">
                                      {authenticatedUser.username}
                                    </span>
                                    <span>
                                      submitted at {formatDate(sub.createdAt)}
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <Badge variant={"secondary"} ><Clock className="w-4 h-4" /> {Math.round(Number(sub.time.slice(0, -2)))} ms</Badge>
                                    <Badge variant="secondary"><MemoryStick className="w-4 h-4" /> {Math.round(Number(sub.memory.slice(0, -2)))} MB</Badge>
                                  </div>
                                </DialogDescription>
                              </DialogHeader>
                              <SyntaxHighlighter
                                language={sub.language.toLowerCase()}
                                style={theme==="light" ? github : dracula}
                                wrapLongLines
                                customStyle={{ borderRadius: '0.5rem', fontSize: '0.9rem' }}
                              >
                                {sub.sourceCode.code ||
                                 "Unable to fetch solution right now.."}
                              </SyntaxHighlighter>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button type="button" variant="secondary">Close</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>       
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
              </ScrollArea>
            </div> 
        }
    </div>
  )
};

export default ProfilePage;