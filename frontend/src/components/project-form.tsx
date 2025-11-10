'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ProjectFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
  };
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Project name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Project Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="My Awesome Project"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting || isLoading}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your project's goals and objectives..."
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting || isLoading}
          rows={4}
          className={errors.description ? 'border-red-500' : ''}
        />
        <p className="text-xs text-slate-500">
          {formData.description.length}/500
        </p>
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
        >
          {isSubmitting ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Project' : 'Create Project')}
        </Button>
      </div>
    </form>
  );
}
