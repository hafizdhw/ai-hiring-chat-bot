import Link from 'next/link'
import { Upload, MessageSquare } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">
          AI Hiring Chat Bot
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload candidate data and chat with AI to evaluate candidates using natural language queries.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="card-header">
            <div className="flex items-center space-x-2">
              <Upload className="h-6 w-6 text-primary-600" />
              <h3 className="text-xl font-semibold text-gray-900">Upload Candidates</h3>
            </div>
            <p className="text-gray-600 mt-2">
              Upload CSV files containing candidate interview data and professional summaries.
            </p>
          </div>
          <div className="card-content">
            <p className="text-sm text-gray-500 mb-4">
              Supported fields: applicant_id, interviewer_name, interview_timestamp_utc, 
              professional_summary, primary_language, database_technology, cloud_provider, 
              other_technologies, live_code_summary
            </p>
            <Link href="/upload">
              <button className="btn-primary w-full">
                Upload CSV
              </button>
            </Link>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="card-header">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-primary-600" />
              <h3 className="text-xl font-semibold text-gray-900">AI Chat</h3>
            </div>
            <p className="text-gray-600 mt-2">
              Ask questions about candidates and get AI-powered insights using RAG search.
            </p>
          </div>
          <div className="card-content">
            <p className="text-sm text-gray-500 mb-4">
              Query candidate data using natural language. The AI will search through 
              professional summaries and provide relevant candidate information.
            </p>
            <Link href="/chat">
              <button className="btn-primary w-full">
                Start Chatting
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
