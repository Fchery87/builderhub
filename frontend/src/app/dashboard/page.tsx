"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardOverview } from "@/components/dashboard-overview";
import { ProjectList } from "@/components/project-list";
import { ProjectForm } from "@/components/project-form";
import { TaskList } from "@/components/task-list";
import { TaskBoard } from "@/components/task-board";
import { TaskForm } from "@/components/task-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";

// Mock data fallback for development
const mockProjectsFallback = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design and improved UX",
    owner_id: "user1",
    created_at: Date.now() - 86400000 * 7,
    task_count: 12
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Native mobile application for iOS and Android platforms",
    owner_id: "user1",
    created_at: Date.now() - 86400000 * 14,
    task_count: 8
  },
  {
    id: "3",
    name: "API Integration",
    description: "Integration with third-party payment and analytics APIs",
    owner_id: "user1",
    created_at: Date.now() - 86400000 * 3,
    task_count: 5
  }
];

const mockTasksFallback = [
  {
    id: "1",
    project_id: "1",
    title: "Create wireframes for homepage",
    description: "Design low-fidelity wireframes for the new homepage layout",
    status: "done" as const,
    acceptance_criteria: "Wireframes include header, hero section, features, and footer",
    assignee_id: "user1",
    created_at: Date.now() - 86400000 * 5,
    updated_at: Date.now() - 86400000 * 2,
    assignee_name: "John Doe"
  },
  {
    id: "2",
    project_id: "1",
    title: "Implement responsive navigation",
    description: "Create a responsive navigation menu that works on all screen sizes",
    status: "in_progress" as const,
    acceptance_criteria: "Navigation is fully responsive and accessible",
    assignee_id: "user1",
    created_at: Date.now() - 86400000 * 3,
    updated_at: Date.now() - 86400000 * 1,
    assignee_name: "John Doe"
  },
  {
    id: "3",
    project_id: "2",
    title: "Set up development environment",
    description: "Configure React Native development environment for both iOS and Android",
    status: "todo" as const,
    acceptance_criteria: "Development environment is set up and sample app runs on both platforms",
    assignee_id: "user1",
    created_at: Date.now() - 86400000 * 2,
    updated_at: Date.now() - 86400000 * 2,
    assignee_name: "John Doe"
  }
];

const mockStatsFallback = {
  totalTasks: 25,
  completedTasks: 10,
  inProgressTasks: 8,
  todoTasks: 7,
  totalProjects: 3,
  recentActivity: [
    {
      id: "1",
      type: "task_completed" as const,
      description: "Completed wireframes for homepage",
      timestamp: Date.now() - 3600000 * 2
    },
    {
      id: "2",
      type: "task_updated" as const,
      description: "Updated responsive navigation task",
      timestamp: Date.now() - 3600000 * 5
    },
    {
      id: "3",
      type: "task_created" as const,
      description: "Created new task for API integration",
      timestamp: Date.now() - 3600000 * 24
    }
  ]
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tasks, setTasks] = useState(mockTasksFallback);
  const [stats, setStats] = useState(mockStatsFallback);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const {
    projects,
    loading: projectsLoading,
    createProject,
    updateProject,
    deleteProject,
    refetch: refetchProjects
  } = useProjects();

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch projects
        const projectsResponse = await fetch("/api/projects");
        const projectsData = projectsResponse.ok ? await projectsResponse.json() : mockProjectsFallback;
        setProjects(projectsData || mockProjectsFallback);

        // Fetch tasks
        const tasksResponse = await fetch("/api/tasks");
        const tasksData = tasksResponse.ok ? await tasksResponse.json() : mockTasksFallback;
        setTasks(tasksData || mockTasksFallback);

        // Calculate stats
        const allTasks = tasksData || mockTasksFallback;
        const calculatedStats = {
          totalTasks: allTasks.length,
          completedTasks: allTasks.filter((t: any) => t.status === "done").length,
          inProgressTasks: allTasks.filter((t: any) => t.status === "in_progress").length,
          todoTasks: allTasks.filter((t: any) => t.status === "todo").length,
          totalProjects: (projectsData || mockProjectsFallback).length,
          recentActivity: mockStatsFallback.recentActivity
        };
        setStats(calculatedStats);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Using demo data.");
        // Use fallback data on error
        setProjects(mockProjectsFallback);
        setTasks(mockTasksFallback);
        setStats(mockStatsFallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setEditingProject(project);
      setShowProjectForm(true);
    }
  };

  const handleProjectSubmit = async (projectData: { name: string; description: string }) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData.name, projectData.description);
        toast({
          title: 'Project updated',
          description: `${projectData.name} has been updated successfully.`,
        });
      } else {
        await createProject(projectData.name, projectData.description);
        toast({
          title: 'Project created',
          description: `${projectData.name} has been created successfully.`,
        });
      }
      setShowProjectForm(false);
      await refetchProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save project',
        variant: 'destructive',
      });
    }
  };

  const handleProjectCancel = () => {
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      try {
        await deleteProject(projectId);
        toast({
          title: 'Project deleted',
          description: `${project.name} has been deleted successfully.`,
        });
        await refetchProjects();
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to delete project',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setShowTaskForm(true);
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    setActiveTab("tasks");
  };

  const handleSelectTask = (taskId: string) => {
    handleEditTask(taskId);
  };

  const handleTaskSubmit = async (taskData: any) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === editingTask.id ? updatedTask : task
            )
          );
          setShowTaskForm(false);
        }
      } else {
        // Create new task
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          const newTask = await response.json();
          setTasks(prevTasks => [...prevTasks, newTask]);
          setShowTaskForm(false);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTaskCancel = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const getViewTasks = () => {
    setActiveTab("tasks");
  };

  const getViewProjects = () => {
    setActiveTab("projects");
  };

  const handleTaskUpdate = (taskId: string, newStatus: string) => {
    // Update task status in local state
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus as 'todo' | 'in_progress' | 'done', updated_at: Date.now() }
          : task
      )
    );
    
    // In a real implementation, this would also update the backend
    const updatedTask = tasks.find((task) => task.id === taskId);
    toast({
      title: "Task updated",
      description: updatedTask
        ? `"${updatedTask.title}" moved to ${newStatus.replace("_", " ")}`
        : "Task status updated.",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            stats={stats}
            onViewTasks={getViewTasks}
            onViewProjects={getViewProjects}
            isLoading={isLoading}
          />
        );
      case "projects":
        return (
          <ProjectList
            projects={projects}
            onCreateProject={handleCreateProject}
            onSelectProject={handleSelectProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            isLoading={isLoading}
          />
        );
      case "tasks":
        const projectTasks = selectedProject
          ? tasks.filter(task => task.project_id === selectedProject)
          : tasks;
        const project = selectedProject
          ? projects.find(p => p.id === selectedProject)
          : null;
        
        return (
          <TaskList
            tasks={projectTasks}
            onCreateTask={handleCreateTask}
            onSelectTask={handleSelectTask}
            projectTitle={project?.name}
            isLoading={isLoading}
          />
        );
      case "board":
        const boardTasks = selectedProject
          ? tasks.filter(task => task.project_id === selectedProject)
          : tasks;
        const boardProject = selectedProject
          ? projects.find(p => p.id === selectedProject)
          : null;
        
        return (
          <TaskBoard
            tasks={boardTasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskSelect={handleSelectTask}
            onCreateTask={handleCreateTask}
            projectTitle={boardProject?.name}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <DashboardOverview
            stats={mockStats}
            onViewTasks={getViewTasks}
            onViewProjects={getViewProjects}
          />
        );
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
      
      {/* Project Form Modal */}
      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            initialData={editingProject}
            onSubmit={handleProjectSubmit}
            onCancel={handleProjectCancel}
            isLoading={projectsLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Task Form Modal */}
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            projects={projects}
            users={[]} // Will be populated from InstantDB
            selectedProject={selectedProject || undefined}
            onSubmit={handleTaskSubmit}
            onCancel={handleTaskCancel}
            initialData={editingTask || undefined}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
