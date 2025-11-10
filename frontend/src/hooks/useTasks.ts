'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/instantdb';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  acceptance_criteria: string;
  assignee_id?: string;
  created_at: number;
  updated_at: number;
}

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to set up InstantDB subscription for real-time updates
    const setupSubscription = async () => {
      try {
        // Subscribe to tasks collection with optional project_id filter
        const query: any = { tasks: {} };

        const unsubscribe = db.useQuery(query).subscribe((result: any) => {
          if (result.tasks) {
            // Filter by projectId if specified
            const filteredTasks = projectId
              ? result.tasks.filter((task: Task) => task.project_id === projectId)
              : result.tasks;
            setTasks(filteredTasks);
          }
        });

        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (err) {
        // Fall back to REST API if InstantDB subscription fails
        console.warn('InstantDB subscription unavailable, using REST API:', err);
        fetchTasks();
      }
    };

    setupSubscription();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      let url = `${API_URL}/api/tasks`;
      if (projectId) {
        url += `?project_id=${projectId}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create task');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      return newTask;
    } catch (err) {
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete task');
      }

      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      throw err;
    }
  };

  const getTasksByStatus = (status: 'todo' | 'in_progress' | 'done') => {
    return tasks.filter((t) => t.status === status);
  };

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
  };
}
