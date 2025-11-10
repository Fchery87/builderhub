'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'magic-link' | 'password'>('magic-link');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (loginMethod === 'password') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setLoading(true);

    try {
      if (loginMethod === 'password') {
        // Password login
        const response = await fetch(`${API_URL}/api/auth/login-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to login');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.access_token);

        toast({
          title: 'Welcome back!',
          description: 'You have been logged in successfully.',
        });

        router.push('/dashboard');
      } else {
        // Magic link login
        const response = await fetch(`${API_URL}/api/auth/magic-link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to login');
        }

        toast({
          title: 'Magic link sent',
          description: 'Check your email for the login link. Valid for 15 minutes.',
        });

        router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your BuilderHub account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-2 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setLoginMethod('magic-link')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                loginMethod === 'magic-link'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                loginMethod === 'password'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Password
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {loginMethod === 'password' && (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading
                ? loginMethod === 'password'
                  ? 'Signing in...'
                  : 'Sending magic link...'
                : loginMethod === 'password'
                ? 'Sign in with password'
                : 'Continue with email'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            <p>
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
            <p>
              {loginMethod === 'password'
                ? 'Sign in with your password'
                : 'We\'ll send you a magic link to sign in securely'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
