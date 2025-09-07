'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Brain } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="glass-effect rounded-full p-4">
              <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="glass-effect rounded-full p-4">
              <Brain className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access this page.
          </p>
          <button
            onClick={() => router.push('/signin')}
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
