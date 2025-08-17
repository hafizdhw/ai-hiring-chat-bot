import Link from 'next/link'
import { Upload, MessageSquare, Users, Brain, Zap, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="glass-effect rounded-full p-4">
                <Brain className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">AI Hiring</span>
              <br />
              <span className="text-gray-800">Assistant</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your hiring process with AI-powered candidate evaluation. 
              Upload data, ask questions, and get intelligent insights instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/upload">
                <button className="btn-primary text-lg px-8 py-4">
                  <Upload className="h-5 w-5 mr-2" />
                  Get Started
                </button>
              </Link>
              <Link href="/chat">
                <button className="btn-outline text-lg px-8 py-4">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Try Demo Chat
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need for smart hiring
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your candidate evaluation process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="feature-card">
            <div className="card-header">
              <div className="flex items-center space-x-3 mb-4">
                <div className="step-indicator">1</div>
                <Upload className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Upload Data</h3>
              </div>
              <p className="text-gray-600">
                Upload applicant profiles and interview data via CSV. Supports both applicant and interview formats.
              </p>
            </div>
            <div className="card-content">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Applicant profiles with full details
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Interview summaries with embeddings
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Automatic data validation
                </div>
              </div>
              <Link href="/upload" className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium">
                Upload Now <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="feature-card">
            <div className="card-header">
              <div className="flex items-center space-x-3 mb-4">
                <div className="step-indicator">2</div>
                <Brain className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">AI Analysis</h3>
              </div>
              <p className="text-gray-600">
                Advanced AI with RAG technology searches through candidate data using semantic similarity.
              </p>
            </div>
            <div className="card-content">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Semantic search with embeddings
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Natural language queries
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Context-aware responses
                </div>
              </div>
              <Link href="/chat" className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium">
                Start Chatting <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="feature-card">
            <div className="card-header">
              <div className="flex items-center space-x-3 mb-4">
                <div className="step-indicator">3</div>
                <Zap className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Smart Insights</h3>
              </div>
              <p className="text-gray-600">
                Get detailed insights about candidates, skills, experience, and interview performance.
              </p>
            </div>
            <div className="card-content">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Candidate skill analysis
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Interview performance insights
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Relevance scoring
                </div>
              </div>
              <Link href="/chat" className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium">
                Explore Insights <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Start Guide</h3>
            <p className="text-gray-600">Get up and running in minutes</p>
          </div>
          <div className="card-content">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="glass-effect rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Upload Data</h4>
                <p className="text-sm text-gray-600">Upload your applicant and interview CSV files</p>
              </div>
              <div className="text-center">
                <div className="glass-effect rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Ask Questions</h4>
                <p className="text-sm text-gray-600">Use natural language to query your candidate data</p>
              </div>
              <div className="text-center">
                <div className="glass-effect rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Get Insights</h4>
                <p className="text-sm text-gray-600">Receive AI-powered insights and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
