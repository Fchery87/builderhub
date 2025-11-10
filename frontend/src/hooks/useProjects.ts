'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/instantdb';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: number;
  task_count?: number;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to set up InstantDB subscription for real-time updates
    const setupSubscription = async () => {
      try {
        // Subscribe to projects collection for real-time updates
        // Note: This requires InstantDB to be properly configured with a valid APP_ID
        const unsubscribe = db.useQuery({
          projects: {},
        }).subscribe((result: any) => {
          if (result.projects) {
            setProjects(result.projects);
          }
        });

        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (err) {
        // Fall back to REST API if InstantDB subscription fails
        console.warn('InstantDB subscription unavailable, using REST API:', err);
        fetchProjects();
      }
    };

    setupSubscription();
  }, []);

  const fetchProjects = async () => {
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

      const response = await fetch(`${API_URL}/api/projects`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (name: string, description: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create project');
      }

      const newProject = await response.json();
      setProjects([...projects, newProject]);
      return newProject;
    } catch (err) {
      throw err;
    }
  };

  const updateProject = async (projectId: string, name: string, description: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update project');
      }

      const updatedProject = await response.json();
      setProjects(projects.map((p) => (p.id === projectId ? updatedProject : p)));
      return updatedProject;
    } catch (err) {
      throw err;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete project');
      }

      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (err) {
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
