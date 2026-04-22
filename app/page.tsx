'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AuthForm from '@/components/AuthForm'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/todos')
    })
  }, [router])

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <AuthForm />
    </main>
  )
}