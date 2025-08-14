'use client'

import { useState } from 'react'
import { Upload, ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Candidate {
  applicant_id: string
  interviewer_name: string
  interview_timestamp_utc: string
  professional_summary: string
  primary_language: string
  database_technology: string
  cloud_provider: string
  other_technologies: string
  live_code_summary: string
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      return
    }

    setFile(selectedFile)
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const text = await selectedFile.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      const parsedCandidates: Candidate[] = []
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
          const candidate: Candidate = {
            applicant_id: values[0] || '',
            interviewer_name: values[1] || '',
            interview_timestamp_utc: values[2] || '',
            professional_summary: values[3] || '',
            primary_language: values[4] || '',
            database_technology: values[5] || '',
            cloud_provider: values[6] || '',
            other_technologies: values[7] || '',
            live_code_summary: values[8] || '',
          }
          parsedCandidates.push(candidate)
        }
      }

      setCandidates(parsedCandidates)
    } catch (err) {
      setError('Error parsing CSV file')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!candidates.length) return

    setIsUploading(true)
    setError(null)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidates }),
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      setSuccess(`Successfully uploaded ${candidates.length} candidates`)
      setCandidates([])
      setFile(null)
    } catch (err) {
      setError('Failed to upload candidates')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Upload className="h-6 w-6" />
              <span>Upload Candidate Data</span>
            </h2>
            <p className="text-gray-600 mt-2">
              Upload a CSV file containing candidate interview data. The file should include headers for all required fields.
            </p>
          </div>
          <div className="card-content space-y-4">
            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isLoading}
                className="input"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 text-green-600">
                <span>{success}</span>
              </div>
            )}

            {isLoading && (
              <div className="text-sm text-gray-500">
                Parsing CSV file...
              </div>
            )}
          </div>
        </div>

        {candidates.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-semibold text-gray-900">Preview ({candidates.length} candidates)</h3>
              <p className="text-gray-600 mt-2">
                Review the data before uploading to the database.
              </p>
            </div>
            <div className="card-content">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviewer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Language</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Database</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cloud</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.slice(0, 10).map((candidate, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {candidate.applicant_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.interviewer_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.interview_timestamp_utc}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.primary_language}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.database_technology}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.cloud_provider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {candidates.length > 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing first 10 of {candidates.length} candidates
                </p>
              )}

              <div className="mt-4">
                <button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="btn-primary w-full"
                >
                  {isUploading ? 'Uploading...' : `Upload ${candidates.length} Candidates`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
