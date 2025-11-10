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
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Target,
  Eye,
  EyeOff
} from "lucide-react";

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

export function EnhancedTaskForm({ 
  projects, 
  users, 
  selectedProject,
  onSubmit, 
  onCancel,
  initialData 
}: TaskFormProps) {
  const { toast } = useToast();

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
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);

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
        if (!value) return 'Please select a project';
        break;
    }
    return undefined;
  };

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (touched.has(field)) {
      const error = validateField(field, value);
      setFormErrors(prev => ({ ...prev, [field]: error }));
    }
    
    if (field === "title" || field === "description") {
      setGenerationError(null);
    }
  };

  const handleFieldBlur = (field: keyof TaskFormData) => {
    setTouched(prev => new Set(prev).add(field));
    const error = validateField(field, formData[field]);
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    ['title', 'description', 'project_id'].forEach(field => {
      const error = validateField(field as keyof TaskFormData, formData[field as keyof TaskFormData]);
      if (error) {
        errors[field as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    setTouched(new Set(['title', 'description', 'project_id']));
    return isValid;
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
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
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
  const hasErrors = Object.values(formErrors).some(error => error);

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 bg-gradient-to-br from-card to-card/95">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-6 w-6 text-primary" />
                {initialData ? "Edit Task" : "Create New Task"}
              </CardTitle>
              <CardDescription className="text-base">
                {selectedProjectName 
                  ? `Adding task to ${selectedProjectName}`
                  : "Fill in the details below to create a new task"
                }
              </CardDescription>
            </div>
            {formData.acceptance_criteria && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2"
                  >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    Preview
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showPreview ? 'Hide' : 'Show'} task preview</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {showPreview && (
            <Alert className="border-primary/20 bg-primary/5">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Preview:</strong> {formData.title}
                {formData.description && (
                  <div className="mt-2 text-sm opacity-90">{formData.description}</div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Selection */}
            {!selectedProject && (
              <div className="space-y-3">
                <Label htmlFor="project" className="text-base font-medium flex items-center gap-2">
                  Project <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.project_id}
                  onValueChange={(value) => handleInputChange("project_id", value)}
                  onOpenChange={() => handleFieldBlur("project_id")}
                >
                  <SelectTrigger className={`h-12 ${formErrors.project_id ? 'border-destructive' : ''}`}>
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
                {formErrors.project_id && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.project_id}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Task Title */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-medium flex items-center gap-2">
                    Task Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    onBlur={() => handleFieldBlur("title")}
                    placeholder="Enter task title"
                    className={`h-12 ${formErrors.title ? 'border-destructive' : ''}`}
                  />
                  {formErrors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.title}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Be specific and concise</span>
                    <span>{formData.title.length}/100</span>
                  </div>
                </div>

                {/* Task Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-medium flex items-center gap-2">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    onBlur={() => handleFieldBlur("description")}
                    placeholder="Describe what needs to be done, why it's important, and any context needed"
                    rows={6}
                    className={`resize-none ${formErrors.description ? 'border-destructive' : ''}`}
                  />
                  {formErrors.description && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.description}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {formData.description.length} characters
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Assignee */}
                <div className="space-y-3">
                  <Label htmlFor="assignee" className="text-base font-medium">Assignee</Label>
                  <Select
                    value={formData.assignee_id || ""}
                    onValueChange={(value) => handleInputChange("assignee_id", value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <span>{user.email}</span>
                            <Badge variant="secondary" className="text-xs">
                              {user.role}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Acceptance Criteria */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="acceptance_criteria" className="text-base font-medium">
                      Acceptance Criteria
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateAcceptanceCriteria}
                          disabled={isGeneratingCriteria || !formData.title.trim() || !formData.description.trim()}
                          className="flex items-center gap-2"
                        >
                          {isGeneratingCriteria ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                          {isGeneratingCriteria ? "Generating..." : "AI Generate"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate acceptance criteria using AI</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Textarea
                    id="acceptance_criteria"
                    value={formData.acceptance_criteria || ""}
                    onChange={(e) => handleInputChange("acceptance_criteria", e.target.value)}
                    placeholder="Define the conditions that must be met for this task to be considered complete&#10;&#10;Example:&#10;• User can successfully log in with valid credentials&#10;• Error message appears for invalid credentials&#10;• Password field shows masked input"
                    rows={8}
                    className="resize-none"
                  />
                  {generationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{generationError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Form Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Required fields are marked with *
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="h-11 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || hasErrors}
                  className="h-11 px-6 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Saving..." : (initialData ? "Update Task" : "Create Task")}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}