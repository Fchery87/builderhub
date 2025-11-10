"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Save, Sparkles, Loader2 } from "lucide-react";

interface TaskFormData {
  title: string;
  description: string;
  project_id: string;
  assignee_id?: string;
  acceptance_criteria?: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  project_id?: string;
}

interface Project {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  role: string;
}

interface TaskFormProps {
  projects: Project[];
  users: User[];
  selectedProject?: string;
  onSubmit: (taskData: TaskFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
}

export function TaskForm({ 
  projects, 
  users, 
  selectedProject,
  onSubmit, 
  onCancel,
  initialData 
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    project_id: selectedProject || "",
    assignee_id: "",
    acceptance_criteria: "",
    ...initialData
  });

  const [isGeneratingCriteria, setIsGeneratingCriteria] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedProject && !formData.project_id) {
      setFormData(prev => ({ ...prev, project_id: selectedProject }));
    }
  }, [selectedProject, formData.project_id]);

  const validateField = (field: keyof TaskFormData, value: string): string | undefined => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Task title is required';
        if (value.trim().length < 3) return 'Title must be at least 3 characters';
        if (value.trim().length > 100) return 'Title must be less than 100 characters';
        break;
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 10) return 'Description must be at least 10 characters';
        break;
      case 'project_id':
        if (!value.trim()) return 'Please select a project';
        break;
    }
    return undefined;
  };

  const getFieldError = (field: keyof TaskFormData) => {
    return touched.has(field) ? errors[field] : undefined;
  };

  const isFieldValid = (field: keyof TaskFormData) => {
    return touched.has(field) && !errors[field] && formData[field];
  };

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => new Set(prev).add(field));
    
    // Clear errors when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    if (field === "title" || field === "description") {
      setGenerationError(null);
    }
    
    // Real-time validation
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const generateAcceptanceCriteria = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setGenerationError("Please provide both title and description before generating criteria");
      return;
    }

    setIsGeneratingCriteria(true);
    setGenerationError(null);

    try {
      const response = await fetch("/api/ai/generate-acceptance-criteria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_title: formData.title,
          task_description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate acceptance criteria");
      }

      const result = await response.json();
      
      if (result.success && result.criteria) {
        // Format the AI response into a readable format
        const formattedCriteria = Array.isArray(result.criteria) 
          ? result.criteria.map((c: any) => `• ${c}`).join('\n')
          : result.criteria;
        
        handleInputChange("acceptance_criteria", formattedCriteria);
      } else {
        throw new Error(result.error || "Failed to generate criteria");
      }
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsGeneratingCriteria(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.project_id) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Show success toast
      toast({
        title: initialData ? "Task Updated" : "Task Created",
        description: initialData
          ? `"${formData.title}" has been updated successfully.`
          : `"${formData.title}" has been created successfully.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProjectName = projects.find(p => p.id === formData.project_id)?.name;

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-2xl transition dark:border-slate-800 dark:bg-slate-900/80">
      <CardHeader className="space-y-2">
        <CardTitle className="flex flex-wrap items-center gap-3 text-2xl font-semibold dark:text-white">
          {initialData ? "Edit Task" : "Create New Task"}
          {selectedProjectName && (
            <Badge className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-300">
              Adding to {selectedProjectName}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
          {selectedProjectName
            ? `Tasks created for ${selectedProjectName} show up instantly in their board.`
            : "Fill in the fields below to craft a clear, actionable task."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 gap-2 rounded-full border border-slate-200/70 bg-slate-200/70 p-1 dark:border-slate-800/70 dark:bg-slate-900/60">
              <TabsTrigger value="details" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                Details
              </TabsTrigger>
              <TabsTrigger value="acceptance" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                Acceptance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 pt-4">
              {!selectedProject && (
                <div className="space-y-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select
                    value={formData.project_id}
                    onValueChange={(value) => handleInputChange("project_id", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  Task Title *
                  {isFieldValid("title") && (
                    <Badge className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-emerald-700">
                      Ready
                    </Badge>
                  )}
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Describe the mission in a sentence"
                  className={getFieldError("title") ? "border-red-500 focus:border-red-500" : isFieldValid("title") ? "border-emerald-500 focus:border-emerald-500" : ""}
                  required
                />
                {getFieldError("title") && (
                  <div className="text-sm text-red-500">{getFieldError("title")}</div>
                )}
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {formData.title.length}/100 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  Description *
                  {isFieldValid("description") && (
                    <Badge className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-emerald-700">
                      Solid
                    </Badge>
                  )}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Share the scope, success criteria, and any context"
                  rows={4}
                  className={getFieldError("description") ? "border-red-500 focus:border-red-500" : isFieldValid("description") ? "border-emerald-500 focus:border-emerald-500" : ""}
                  required
                />
                {getFieldError("description") && (
                  <div className="text-sm text-red-500">{getFieldError("description")}</div>
                )}
                <p className="text-xs text-slate-400 dark:text-slate-500">Minimum 10 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={formData.assignee_id || "unassigned"}
                  onValueChange={(value) => handleInputChange("assignee_id", value === "unassigned" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <span>{user.email}</span>
                          <Badge className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.6rem] text-slate-500">
                            {user.role}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="acceptance" className="space-y-4 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label htmlFor="acceptance_criteria" className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Acceptance Criteria
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={generateAcceptanceCriteria}
                        disabled={isGeneratingCriteria || !formData.title.trim() || !formData.description.trim()}
                        className="flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-cyan-500 hover:text-cyan-600"
                      >
                        {isGeneratingCriteria ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 text-cyan-500" />
                        )}
                        {isGeneratingCriteria ? "Generating..." : "Generate with AI"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Uses AI to summarize acceptance criteria from your description.</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="acceptance_criteria"
                value={formData.acceptance_criteria || ""}
                onChange={(e) => handleInputChange("acceptance_criteria", e.target.value)}
                placeholder="Define the conditions that must be met for this task to be considered complete"
                rows={6}
              />
              {generationError && (
                <Alert variant="destructive">
                  <AlertDescription>{generationError}</AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 dark:border-slate-800/80">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need extra help? The AI helper will take your title and description to craft feedback instantly.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.project_id}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? "Saving..." : initialData ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
