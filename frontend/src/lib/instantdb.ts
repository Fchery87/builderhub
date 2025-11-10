import { init } from '@instantdb/react';

// Initialize InstantDB client with your app ID
const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || '';

if (!APP_ID) {
  throw new Error('NEXT_PUBLIC_INSTANTDB_APP_ID environment variable is required');
}

export const db = init({
  appId: APP_ID,
});

// Export types for our schema
export type User = {
  id: string;
  email: string;
  role: 'developer' | 'project_manager' | 'qa';
  created_at: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: number;
};

export type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  acceptance_criteria: string;
  assignee_id: string;
  created_at: number;
  updated_at: number;
};

// Export schema for type safety
export const schema = {
  users: {} as User,
  projects: {} as Project,
  tasks: {} as Task,
};