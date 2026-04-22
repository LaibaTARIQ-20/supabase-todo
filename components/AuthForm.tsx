'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for a confirmation link!')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/todos')
      }
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo / Title */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-stone-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-stone-800">
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          {mode === 'signin' ? 'Sign in to your todos' : 'Start tracking your tasks'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent transition"
          />
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        {message && (
          <div className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      {/* Toggle mode */}
      <p className="text-center text-sm text-stone-400 mt-5">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <Link
          href={mode === 'signin' ? '/register' : '/login'}
          className="text-stone-700 font-medium hover:underline"
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </Link>
      </p>
    </div>
  )
}