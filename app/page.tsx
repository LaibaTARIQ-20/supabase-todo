'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/todos')
      } else {
        router.push('/login')
      }
    })
  }, [router])

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="text-stone-500 animate-pulse">Loading...</div>
    </main>
  )
}