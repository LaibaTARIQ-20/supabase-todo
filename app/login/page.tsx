import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <AuthForm mode="signin" />
    </main>
  )
}
