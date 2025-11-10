'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We sent a magic link to <span className="font-medium text-slate-900">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Click the link in your email to complete your sign in. The link is valid for 15 minutes.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-2">Didn't receive the email?</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email address</li>
                <li>• Try requesting a new magic link below</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Request a new magic link
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
