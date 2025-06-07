import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Clock, Loader, MemoryStick, Timer } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "./ui/separator";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula, github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useThemeStore } from "@/store/useThemeStore";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/useAuthStore";


export function TabsDemo({ activeTab, setActiveTab, problem, submission, expOut, submissions, isLoadingSubmissions, isRunCode}) {
  const [solutionLang, setSolutionLang] = useState("PYTHON");

  const { theme } = useThemeStore();
  const { authenticatedUser } = useAuthStore();

  const tabContent = [
    {
      key: "editorial",
      title: "Editorial",
      content: problem?.editorial || "No editorial available.",
    },
  ];

  const formatDate = (rawDate) => {
  const date = new Date(rawDate);
    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
        });
    };

  if (!problem || !authenticatedUser) {
    return (
      <div className="flex justify-center items-center h-screen w-full md:w-1/2">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <Tabs
      defaultValue="description"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full overflow-y-auto"
    >
        <TabsList className="w-full justify-start bg-[#f5f5f4] dark:bg-[#27272a] flex-nowrap">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger className="hidden md:block" value="editorial">
            Editorial
            </TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
            <TabsTrigger value="testcases">Testcases</TabsTrigger>
            <TabsTrigger value="submission">Submissions</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
            <Card className="p-4 h-full">
                <ScrollArea className="h-full pr-2">
                    <div className="space-y-4 text-muted-foreground">
                        <div>
                            <h3 className="text-2xl font-bold text-black dark:text-white mb-4">{problem?.title}</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <Badge className={`${problem.difficulty === "EASY" && "bg-[#2cbb52]"} ${problem.difficulty === "MEDIUM" && "bg-[#fcb700]"} ${problem.difficulty === "HARD" && "bg-[#ff6467]"}`}>
                                    {problem?.difficulty}
                                </Badge>
                                {problem?.tags.map((tag, i) => (
                                <Badge key={i}>
                                    {tag.slice(0, 1).toUpperCase() + tag.slice(1)}
                                </Badge>
                                ))}
                            </div>
                        </div>

                
                        <p className="text-black dark:text-white text-md whitespace-pre-wrap break-words">{problem?.description}</p>

                
                        {problem?.examples && (
                            <div>
                                <h4 className="mt-4 text-black dark:text-white">Examples</h4>
                                <div className="space-y-4 mt-2">
                                    {Object.entries(problem.examples).map(([lang, ex], index) => (
                                        <div key={index} className="border p-4 rounded bg-muted text-sm space-y-1 font-mono">
                                            <div>
                                                <span className="font-semibold">Input: </span>
                                                <span className="whitespace-pre-wrap break-words">{ex.input}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold">Output: </span>
                                                <span className="whitespace-pre-wrap break-words">{ex.output}</span>
                                            </div>
                                            {ex.explanation && (
                                            <div>
                                                <span className="font-semibold">Explanation: </span>
                                                <span className="whitespace-pre-wrap break-words">{ex.explanation}</span>
                                            </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {problem?.constraints && (
                            <div className="space-y-1">
                                <Separator />
                                <h4 className="mt-4 text-black dark:text-white">Constraints</h4>
                                {/* <p className="whitespace-pre-wrap font-mono bg-[#f5f5f4] dark:bg-[#27272b] rounded-lg w-fit p-2">{problem.constraints}</p> */}
                                <ul className="list-disc whitespace-pre-wrap font-mono bg-[#f5f5f4] dark:bg-[#27272b] rounded-lg p-2 pl-8">
                                    {problem.constraints.split("\n").map((c, index) => (
                                        <li key={index}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </Card>
        </TabsContent>


        
        {tabContent.map((tab) => (
            <TabsContent value={tab.key} key={tab.key} className="flex-1">
            <Card className="p-4 h-full">
                <ScrollArea className="h-full pr-2">
                <h2 className="text-xl font-semibold mb-2">{tab.title}</h2>
                <p className="text-md whitespace-pre-wrap text-muted-foreground">
                    {tab.content || "Loading..."}
                </p>
                </ScrollArea>
            </Card>
            </TabsContent>
        ))}

        
        <TabsContent value="solutions">
            <Card className="p-4 h-full">
                <ScrollArea className="h-full pr-2">
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Solutions</h2>
                    <Select
                        defaultValue="PYTHON"
                        onValueChange={(val) => setSolutionLang(val)}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PYTHON">Python</SelectItem>
                            <SelectItem value="JAVA">Java</SelectItem>
                            <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                <SyntaxHighlighter
                    language={solutionLang.toLowerCase()}
                    style={theme==="light" ? github : dracula}
                    wrapLongLines
                    customStyle={{ borderRadius: '0.5rem', fontSize: '0.9rem' }}
                >
                    {problem?.referenceSolutions?.[solutionLang] ||
                    "No solution available for selected language."}
                </SyntaxHighlighter>
                
            </ScrollArea>
            </Card>
        </TabsContent>

        
        
        
        <TabsContent value="testcases">
            <Card className="p-4 h-full">
            <ScrollArea className="h-full pr-2">
                <h2 className="text-xl font-semibold mb-2">Testcases</h2>
                {problem?.testcases?.length > 0 ? (
                <div className="flex flex-col gap-4 text-muted-foreground">
                    {problem.testcases.map((tc, index) => (
                    <div
                        key={index}
                        className="border font-mono rounded-lg p-3 bg-[#f5f5f4] dark:bg-[#27272a]"
                    >
                        <div className="mb-2 flex items-center gap-2">
                            <p className="text-black dark:text-white">Input:</p>
                            <p className="whitespace-pre-wrap break-words">
                                {tc.input}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <p className="text-black dark:text-white">
                                Expected Output:
                            </p>
                            <p className="whitespace-pre-wrap break-words">
                                {tc.output}
                            </p>
                        </div>
                    
                    </div>
                    ))}
                </div>
                ) : (
                <p className="text-md text-muted-foreground">
                    No testcases available.
                </p>
                )}
                </ScrollArea>
            </Card>
        </TabsContent>
        
        
        
        
        
        <TabsContent value="result">
  <Card className="h-full p-4">
    {isRunCode ? (
      !submission ? (
        <ScrollArea className="h-full pr-2">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          <p className="text-md whitespace-pre-wrap text-muted-foreground">
            You must Run or Submit your code first.
          </p>
        </ScrollArea>
      ) : submission.testcaseResult && submission.testcaseResult.length > 0 ? (
        // Show detailed test case results with tabs
        <ScrollArea className="h-full pr-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Execution Result</h2>
              <div className="flex gap-2">
                <Badge variant="secondary"><Clock /> {submission.time}</Badge>
                <Badge variant="secondary"><MemoryStick /> {submission.memory}</Badge>
              </div>
            </div>

            <Tabs defaultValue={0} className="space-y-2">
              <TabsList className="w-full flex-wrap">
                {submission.testcaseResult.map((tc, index) => (
                  <TabsTrigger key={index} value={index} className="text-sm">
                    Test Case {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>

              {submission.testcaseResult.map((tc, index) => (
                <TabsContent value={index} key={index}>
                  <div className="bg-[#ececec] dark:bg-[#27272a] p-4 rounded-lg space-y-4 text-md">
                    <p
                      className={`text-xl font-semibold ${
                        tc.status?.trim().toLowerCase() === "accepted"
                          ? "text-[#2cbb5d]"
                          : "text-[#ef4743]"
                      }`}
                    >
                      {tc.status}
                    </p>

                    <div className="font-mono">
                      <p className="text-muted-foreground font-semibold mb-1">Input</p>
                      <pre className="bg-[#f5f5f4] dark:bg-[#353535] p-2 rounded-md whitespace-pre-wrap">{tc.stdin}</pre>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold mb-1">Expected Output</p>
                      <pre className="bg-[#f5f5f4] dark:bg-[#353535] p-2 rounded-md whitespace-pre-wrap">{expOut[index]}</pre>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold mb-1">Your Output</p>
                      <pre className="bg-[#f5f5f4] dark:bg-[#353535] p-2 rounded-md whitespace-pre-wrap">{tc.stdout}</pre>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold mb-1">Error</p>
                      <pre className="bg-[#f5f5f4] dark:bg-[#353535] p-2 rounded-md whitespace-pre-wrap">{tc.stderr || "—"}</pre>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </ScrollArea>
      ) : (
        <p className="text-muted-foreground">No test cases were executed.</p>
      )
    ) : submission ? (
      // Submission summary (show only one result)
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <div>
            {(() => {
              const allAccepted = submission.status
                .split("\n")
                .every((res) => res.trim().toLowerCase() === "accepted");
              const lastStatus = submission.status.split("\n").slice(-1)[0].trim();
              const displayStatus = allAccepted
                ? "Accepted"
                : lastStatus === "Runtime Error (NZEC)"
                ? "Runtime Error"
                : lastStatus;

              return (
                <p className={` text-2xl ${allAccepted ? "text-[#2cbb52]" : "text-[#ef4743]"}`}>
                  {displayStatus}
                </p>
              );
            })()}

            <p className={"flex items-center gap-2 py-2"}>
              <img
                src={authenticatedUser.avatar || "https://avatar.iran.liara.run/public/boy"}
                alt="User"
                className="w-5 h-5 rounded-full border border-border object-cover"
              />
              <span className="text-black dark:text-white">{authenticatedUser.username}</span>
              <span className="text-muted-foreground">submitted at {formatDate(submission.createdAt)}</span>
            </p>
          </div>
          <div className="flex items-center justify-center p-4 gap-4 rounded-lg border-border border">
            <div className="border border-border rounded-xl p-4 bg-[#f5f5f4] dark:bg-[#27272b] w-1/2 space-y-1">
              <div className="flex items-center gap-2 justify-center">
                <Clock />
                <span> Runtime</span>
              </div>
              <p className="text-lg md:text-xl text-center">{submission.time}</p>
            </div>
            <div className="border border-border p-4 rounded-xl bg-[#f5f5f4] dark:bg-[#27272b] w-1/2 space-y-1">
              <div className="flex items-center gap-2 justify-center">
                <MemoryStick />
                <span>Memory</span>
              </div>
              <p className="text-lg md:text-xl text-center">{submission.memory}</p>
            </div>
          </div>
        </div>
        <div className="space-y-2 border border-border rounded-lg p-4">
          <p className="md:text-lg">Your Code :</p>
          <SyntaxHighlighter
            language={solutionLang.toLowerCase()}
            style={theme === "light" ? github : dracula}
            wrapLongLines
            customStyle={{ borderRadius: "0.5rem", fontSize: "0.9rem" }}
          >
            {submission.sourceCode?.code || "No solution available for selected language."}
          </SyntaxHighlighter>
        </div>
      </div>
    ) : (
      <ScrollArea className="h-full pr-2">
        <h2 className="text-xl font-semibold mb-2">Result</h2>
        <p className="text-md whitespace-pre-wrap text-muted-foreground">
          You must Run or Submit your code first.
        </p>
      </ScrollArea>
    )}
  </Card>
</TabsContent>


        
        
        
        
        
        <TabsContent value="submission">
            {isLoadingSubmissions && (
                <div className="flex justify-center items-center h-screen w-full md:w-1/2">
                    <Loader className="animate-spin size-10" />
                </div>  
            )}
            <Card className="p-4 h-full">
                <ScrollArea className="h-full pr-2">
                    <h2 className="text-xl font-semibold mb-4">Your Submissions</h2>
                    {!submissions || submissions.length === 0 ? (
                        <p className="text-muted-foreground">No submissions yet. Refresh to fetch (if any).</p>
                    ) : (
                        <div className="space-y-4">
                        {submissions.slice().reverse().map((sub, index) => (
                            <div key={index} className={`border p-4 rounded-md bg-[#f5f5f4] dark:bg-[#27272a] grid grid-cols-6 items-center ${sub.status.split("\n").every((res) => res.toLowerCase() === "accepted") ? "text-[#2cbb52]" : "text-[#ef4743]"}`}>
                                    
                                <p className="col-span-2">{sub.status.split("\n").every((res) => res.toLowerCase() === "accepted") ? "Accepted" : sub.status.split("\n").slice(-1) == "Runtime Error (NZEC)" ? "Runtime Error" : sub.status.split("\n").slice(-1) }</p>
                                    
                                    
                                <div className="col-span-3 flex items-center">
                                    <Badge>{sub.language}</Badge>
                                    <Badge variant={"secondary"} ><Clock className="w-4 h-4" /> {Math.round(Number(sub.time.slice(0, -2)))} ms</Badge>
                                    <Badge variant="secondary"><MemoryStick className="w-4 h-4" /> {Math.round(Number(sub.memory.slice(0, -2)))} MB</Badge>
                                </div>

                                    
                                    
                                <Dialog className="col-span-1">
                                    <DialogTrigger asChild>
                                        <Button className={"text-xs md:text-sm"}>View Code</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className={`${sub.status.split("\n").every((res) => res.toLowerCase() === "accepted") ? "text-[#2cbb52]" : "text-[#ef4743]"}`}>
                                                {sub.status.split("\n").every((res) => res.toLowerCase() === "accepted") ? "Accepted" : sub.status.split("\n").slice(-1) == "Runtime Error (NZEC)" ? "Runtime Error" : sub.status.split("\n").slice(-1) }
                                            </DialogTitle>
                                            <DialogDescription className={"flex items-center gap-2 py-2"}>
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
                                                <Button type="button" variant="secondary">
                                                    Close
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>       
                                
                            </div>
                            
                        ))}
                        </div>
                    )}
                </ScrollArea>
            </Card>
        </TabsContent>
      

    </Tabs>
  );
}
