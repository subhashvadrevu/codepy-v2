import React from 'react'
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod"
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState } from 'react';
import {axiosInstance} from "../utilities/axios.js"
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {problemSchema} from "../utilities/zodSchema.js";
import { useThemeStore } from '@/store/useThemeStore.js';
import SelectMulti from "react-select";

const CreateProblemForm = () => {

      const { theme } = useThemeStore();
  
      const tagOptions = [
      { value: "array", label: "Array" },
      { value: "string", label: "String" },
      { value: "hash table", label: "Hash Table" },
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
      { value: "math", label: "Math"},
      { value: "prefix sum", label: "Prefix Sum" },
   ]


  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async(data) => {
    try {
      console.log("Form data being submitted: ", data);
      setIsLoading(true);
      const res = await axiosInstance.post("/problems/createProblem", data);
      console.log("Problem creation request sent : ", res.data);
      toast.success(res.data.message || "Problem created successfully");
      navigate("/");
    } catch (error) {
      console.log("problem creation error: ", error);
      toast.error(error?.response?.data?.error || "Failed to create problem");
    } finally {
      setIsLoading(false);
    }
  };

  // Add form validation error handler
  const onError = (errors) => {
    console.log("Form validation errors:", errors);
    toast.error("Please fix the form errors before submitting");
  };

  const {register, control, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm(
    {
      resolver: zodResolver(problemSchema),
      defaultValues: {
        testcases: [{ input: "", output: "" }],
        examples: [{ input: "", output: "", explanation: "" }],
        tags: [],
        codeSnippets: {
          PYTHON: "def solution():\n    # Write your code here\n    pass\nsolution()",
          // JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
        },
        referenceSolutions: {
          PYTHON: "# Add your reference solution here",
          // JAVA: "// Add your reference solution here",
        },
      }
    }
  )

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestcases,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const {
    fields: exampleFields,
    append: appendExamples,
    remove: removeExamples,
    replace: replaceExamples,
  } = useFieldArray({
    control,
    name: "examples",
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl overflow-y-visible">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <CardTitle>Create Problem</CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
            

            {/* title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  {...register("title")}
                  placeholder="Enter problem title"
                />
                {errors.title && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>



              {/* description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter problem description"
                  className="min-h-32"
                />
                {errors.description && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>


              {/* difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>



              {/* tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <SelectMulti
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    backgroundColor: theme === 'light' ? '#f5f4f4' : '#27272a',
                                    color: theme === 'light' ? 'black' : '#fff',
                                    boxShadow: state.isFocused ? "0 0 0 1px #ff6900" : "none",
                                    border: "none"
                                }),
                                menu: (base) => ({
                                    ...base,
                                    backgroundColor: theme === 'light' ? '#f5f4f4' : '#27272a',
                                    color: theme === 'light' ? 'black' : '#fff',
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused
                                    ? theme === 'light'
                                        ? '#ff6900'
                                        : '#ff6900'
                                    : theme === 'light'
                                    ? '#f5f4f4'
                                    : '#27272a',
                                    color: state.isFocused
                                    ? theme === 'light'
                                        ? '#fff'
                                        : '#fff'
                                    : theme === 'light'
                                    ? 'black'
                                    : 'white',
                                    cursor: 'pointer',
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: theme === 'light' ? '#e4e4e7' : '#3f3f46',
                                    color: theme === 'light' ? 'black' : '#fff',
                                }),
                                multiValueLabel: (base) => ({
                                    ...base,
                                    color: theme === 'light' ? 'black' : '#fff',
                                }),
                                multiValueRemove: (base) => ({
                                    ...base,
                                    color: theme === 'light' ? '#333' : '#fff',
                                    ':hover': {
                                    backgroundColor: theme === 'light' ? '#d4d4d8' : '#52525b',
                                    color: theme === 'light' ? 'black' : '#fff',
                                    },
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: theme === 'light' ? '#737373' : '#a1a1aa',
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: theme === 'light' ? 'black' : '#fff',
                                }), 
                            }}
                            className='w-full rounded-lg'
                            isMulti={true}
                            options={tagOptions}
                            placeholder={"Tags"}
                            value={field.value}
                            onChange={field.onChange}
                        />
                  )}
                />
                {errors.tags && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.tags.message}
                  </p>
                )}
              </div>
            </div>



            {/* testcases */}
            <Card>
              <CardHeader className="px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <CardTitle className="text-lg">Testcases</CardTitle>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => appendTestCase({ input: "", output: "" })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Testcase
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 space-y-6">
                {testCaseFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardHeader className="px-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">
                          Testcase {index + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeTestCase(index)}
                          disabled={testCaseFields.length === 1}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label>Input</Label>
                          <Textarea
                            {...register(`testcases.${index}.input`)}
                            placeholder="Enter test case input"
                            className="min-h-24"
                          />
                          {errors.testcases?.[index]?.input && (
                            <p className="text-sm font-medium text-destructive">
                              {errors.testcases[index].input.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Expected Output</Label>
                          <Textarea
                            {...register(`testcases.${index}.output`)}
                            placeholder="Enter expected output"
                            className="min-h-24"
                          />
                          {errors.testcases?.[index]?.output && (
                            <p className="text-sm font-medium text-destructive">
                              {errors.testcases[index].output.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {errors.testcases && !Array.isArray(errors.testcases) && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.testcases.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* editor - code snippets */}
            <Tabs defaultValue="PYTHON" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="PYTHON">Python</TabsTrigger>
                {/* <TabsTrigger value="JAVA">Java</TabsTrigger> */}
              </TabsList>
              
              {["PYTHON"].map((language) => (
                <TabsContent key={language} value={language} className="space-y-6">
                  <Card>
                    <CardHeader className="px-4">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5" />
                        <CardTitle className="text-lg">{language}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 space-y-6">
                      {/* Starter Code */}
                      <div className="space-y-2">
                        <Label>Starter Code Template</Label>
                        <div className="rounded-md overflow-hidden border">
                          <Controller
                            name={`codeSnippets.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: "on",
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.codeSnippets?.[language] && (
                          <p className="text-sm font-medium text-destructive">
                            {errors.codeSnippets[language].message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <Label>Reference Solution</Label>
                        </div>
                        <div className="rounded-md overflow-hidden border">
                          <Controller
                            name={`referenceSolutions.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: "on",
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.referenceSolutions?.[language] && (
                          <p className="text-sm font-medium text-destructive">
                            {errors.referenceSolutions[language].message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* examples */}
            <Card>
              <CardHeader className="px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <CardTitle className="text-lg">Examples</CardTitle>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => appendExamples({ input: "", output: "", explanation: "" })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add an Example
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="px-4 space-y-6">
                {exampleFields.map((field, index) => (
                  <Card key={field.id}>
                    <CardHeader className="px-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">
                          Example {index + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeExamples(index)}
                          disabled={exampleFields.length === 1}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label>Input</Label>
                          <Textarea
                            {...register(`examples.${index}.input`)}
                            placeholder="Enter test case input"
                            className="min-h-24"
                          />
                          {errors.examples?.[index]?.input && (
                            <p className="text-sm font-medium text-destructive">
                              {errors.examples[index].input.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Output</Label>
                          <Textarea
                            {...register(`examples.${index}.output`)}
                            placeholder="Enter output"
                            className="min-h-24"
                          />
                          {errors.examples?.[index]?.output && (
                            <p className="text-sm font-medium text-destructive">
                              {errors.examples[index].output.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                          <Label>Explanation</Label>
                          <Textarea
                            {...register(`examples.${index}.explanation`)}
                            placeholder="Enter explanation"
                            className="min-h-24"
                          />
                          {errors.examples?.[index]?.explanation && (
                            <p className="text-sm font-medium text-destructive">
                              {errors.examples[index].explanation.message}
                            </p>
                          )}
                        </div>
                    </CardContent>
                  </Card>
                ))}
                {errors.examples && !Array.isArray(errors.examples) && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.examples.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader className="px-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 pt-0 space-y-6">
                <div className="space-y-2">
                  <Label>Constraints</Label>
                  <Textarea
                    {...register("constraints")}
                    placeholder="Enter problem constraints"
                    className="min-h-24"
                  />
                  {errors.constraints && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.constraints.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Hints (Optional)</Label>
                  <Textarea
                    {...register("hints")}
                    placeholder="Enter hints for solving the problem"
                    className="min-h-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Editorial (Optional)</Label>
                  <Textarea
                    {...register("editorial")}
                    placeholder="Enter problem editorial/solution explanation"
                    className="min-h-32"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4 border-t gap-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => reset()}
                disabled={isLoading || isSubmitting}
              >
                Reset
              </Button>
              <Button 
                type="submit" 
                className="gap-2" 
                disabled={isLoading || isSubmitting}
              >
                {(isLoading || isSubmitting) ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Create Problem
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateProblemForm