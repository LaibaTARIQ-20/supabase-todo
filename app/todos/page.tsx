'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TodoList from '@/components/TodoList'

export default function TodosPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/')
      } else {
        setUserEmail(session.user.email ?? null)
        setLoading(false)
      }
    })
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">
              My Todos
            </h1>
            <p className="text-sm text-stone-400 mt-0.5">{userEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-stone-400 hover:text-stone-700 transition-colors border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-100"
          >
            Sign out
          </button>
        </div>

        <TodoList />
      </div>
    </main>
  )
}