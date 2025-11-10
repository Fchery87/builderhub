"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/instantdb";

interface SubscriptionOptions {
  collection: string;
  query?: any;
  orderBy?: string;
  limit?: number;
}

export function useInstantDBSubscription<T = any>(
  options: SubscriptionOptions
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { collection, query, orderBy, limit } = options;
  const queryString = JSON.stringify(query);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Initial query
    let queryBuilder = db.query[collection] as any;

    if (query) {
      queryBuilder = queryBuilder.where(query);
    }

    if (orderBy) {
      queryBuilder = queryBuilder.order(orderBy);
    }

    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }

    // Subscribe to real-time updates
    const unsubscribe = queryBuilder.subscribe({
      onNext: (result: any) => {
        setData(result.data || []);
        setLoading(false);
      },
      onError: (err: Error) => {
        setError(err);
        setLoading(false);
      },
    });

    return () => {
      unsubscribe();
    };
  }, [collection, query, queryString, orderBy, limit]);

  const addItem = useCallback((item: T) => {
    setData(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setData(prev => 
      prev.map(item => 
        (item as any).id === id 
          ? { ...item, ...updates, updated_at: Date.now() } 
          : item
      )
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setData(prev => prev.filter(item => (item as any).id !== id));
  }, []);

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
  };
}

// Specific hooks for our collections
export function useProjects() {
  return useInstantDBSubscription({
    collection: "projects",
    orderBy: "created_at",
  });
}

export function useTasks(projectId?: string) {
  return useInstantDBSubscription({
    collection: "tasks",
    query: projectId ? { project_id: projectId } : undefined,
    orderBy: "updated_at",
  });
}

export function useUsers() {
  return useInstantDBSubscription({
    collection: "users",
    orderBy: "created_at",
  });
}