import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signIn, signUp, signInWithGoogle, signOut } from './supabase'

// Sign in mutation
export const useSignIn = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

// Sign up mutation
export const useSignUp = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUp(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

// Google sign in mutation
export const useGoogleSignIn = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => signInWithGoogle(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

// Sign out mutation
export const useSignOut = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}
