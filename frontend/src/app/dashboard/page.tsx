"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardOverview } from "@/components/dashboard-overview";
import { ProjectList } from "@/components/project-list";
import { TaskList } from "@/components/task-list";
import { TaskBoard } from "@/components/task-board";
import { TaskForm } from "@/components/task-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data for development - this will be replaced with InstantDB integration
const mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design and improved UX",
    owner_id: "user1",
    created_at: Date.now() - 86400000 * 7, // 7 days ago
    task_count: 12
  },
  {
    id: "2", 
    name: "Mobile App Development",
    description: "Native mobile application for iOS and Android platforms",
    owner_id: "user1",
    created_at: Date.now() - 86400000 * 14, // 14 days ago
    task_count: 8
  },
  {
    id: "3",
    name: "API Integration",
    description: "Integration with third-party payment and analytics APIs",
    owner_id: "user1",
    created_at: Date.now() - 86400000 * 3, // 3 days ago
    task_count: 5
  }
];

const mockTasks = [
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

const mockStats = {
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
      timestamp: Date.now() - 3600000 * 2 // 2 hours ago
    },
    {
      id: "2",
      type: "task_updated" as const,
      description: "Updated responsive navigation task",
      timestamp: Date.now() - 3600000 * 5 // 5 hours ago
    },
    {
      id: "3",
      type: "task_created" as const,
      description: "Created new task for API integration",
      timestamp: Date.now() - 3600000 * 24 // 1 day ago
    }
  ]
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState(mockProjects);
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleCreateProject = () => {
    // This will open a modal or navigate to a create project page
    console.log("Create project clicked");
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
      console.error("Failed to save task:", error);
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
    console.log(`Updated task ${taskId} to status ${newStatus}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            stats={mockStats}
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
