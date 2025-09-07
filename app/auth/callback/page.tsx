'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Brain, CheckCircle, XCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          // Redirect to sign in with error
          router.push('/signin?error=auth_callback_failed')
          return
        }

        if (data.session) {
          // Successful authentication
          router.push('/')
          router.refresh()
        } else {
          // No session found
          router.push('/signin?error=no_session')
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        router.push('/signin?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
      
      <div className="relative max-w-md w-full">
        <div className="card text-center">
          <div className="card-content">
            <div className="flex justify-center mb-6">
              <div className="glass-effect rounded-full p-4">
                <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Completing Authentication
            </h2>
            <p className="text-gray-600 mb-6">
              Please wait while we complete your sign-in process...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
