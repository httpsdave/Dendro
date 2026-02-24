'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains uppercase', met: /[A-Z]/.test(password) },
  ];
  const allChecksMet = passwordChecks.every((c) => c.met);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!allChecksMet) {
      setError('Please meet all password requirements.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-forest-50 via-cream-50 to-forest-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-forest-100 p-8 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-display font-bold text-forest-900 mb-2">Check Your Email</h2>
          <p className="text-forest-600 text-sm mb-6">
            We&apos;ve sent a confirmation link to <span className="font-medium text-forest-800">{email}</span>.
            Please verify your email to complete registration.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Go to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-forest-50 via-cream-50 to-forest-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Leaf className="w-8 h-8 text-forest-600" />
            <span className="text-2xl font-display font-bold text-forest-900">Dendro</span>
          </Link>
          <p className="text-forest-500 mt-2">Create your account and start exploring.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-forest-100 p-8">
          <h2 className="text-xl font-display font-bold text-forest-900 mb-6">Create Account</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg mb-4 border border-red-200"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-forest-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan dela Cruz"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-forest-200 rounded-xl text-sm text-forest-900 bg-cream-50 focus:bg-white focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-all placeholder:text-forest-300"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-forest-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-forest-200 rounded-xl text-sm text-forest-900 bg-cream-50 focus:bg-white focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-all placeholder:text-forest-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-forest-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 border border-forest-200 rounded-xl text-sm text-forest-900 bg-cream-50 focus:bg-white focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-all placeholder:text-forest-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password Checks */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className={`flex items-center gap-1.5 text-xs ${check.met ? 'text-green-600' : 'text-forest-400'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${check.met ? 'border-green-500 bg-green-50' : 'border-forest-300'}`}>
                        {check.met && <CheckCircle2 className="w-2.5 h-2.5" />}
                      </div>
                      {check.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-forest-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm text-forest-900 bg-cream-50 focus:bg-white focus:ring-2 focus:ring-forest-100 outline-none transition-all placeholder:text-forest-300 ${
                    confirmPassword.length > 0 && confirmPassword !== password
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-forest-200 focus:border-forest-400'
                  }`}
                />
              </div>
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-forest-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-forest-700 hover:text-forest-900 font-semibold underline underline-offset-2">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
