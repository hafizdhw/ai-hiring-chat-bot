import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import QueryProvider from '@/lib/query-client'
import { AppSidebarProvider } from '@/components/app-sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Hiring Chat Bot',
  description: 'AI-powered candidate evaluation system with CSV upload and RAG chatbot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <AppSidebarProvider>
              {children}
            </AppSidebarProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
