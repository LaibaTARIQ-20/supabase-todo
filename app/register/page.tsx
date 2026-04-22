import AuthForm from '@/components/AuthForm'

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <AuthForm mode="signup" />
    </main>
  )
}
