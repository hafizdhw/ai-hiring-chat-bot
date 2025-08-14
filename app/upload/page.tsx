'use client'

import { useState } from 'react'
import { Upload, ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Applicant {
  applicant_id: string
  full_name: string
  email: string
  role_title: string
  project_name: string
  application_status: string
  seniority_level: string
  applicant_alias: string
}

interface Interview {
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
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
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
      
      // Check if this is applicant data or interview data based on headers
      const isApplicantData = headers.includes('full_name') && headers.includes('email')
      const isInterviewData = headers.includes('interviewer_name') && headers.includes('professional_summary')
      
      if (isApplicantData) {
        const parsedApplicants: Applicant[] = []
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
            const applicant: Applicant = {
              applicant_id: values[0] || '',
              full_name: values[1] || '',
              email: values[2] || '',
              role_title: values[3] || '',
              project_name: values[4] || '',
              application_status: values[5] || '',
              seniority_level: values[6] || '',
              applicant_alias: values[7] || '',
            }
            parsedApplicants.push(applicant)
          }
        }
        
        setApplicants(parsedApplicants)
        setInterviews([])
      } else if (isInterviewData) {
        const parsedInterviews: Interview[] = []
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
            const interview: Interview = {
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
            parsedInterviews.push(interview)
          }
        }
        
        setInterviews(parsedInterviews)
        setApplicants([])
      } else {
        setError('CSV file must contain either applicant data (with full_name, email) or interview data (with interviewer_name, professional_summary)')
        return
      }
    } catch (err) {
      setError('Error parsing CSV file')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!applicants.length && !interviews.length) return

    setIsUploading(true)
    setError(null)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicants, interviews }),
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const totalUploaded = (applicants.length || 0) + (interviews.length || 0)
      setSuccess(`Successfully uploaded ${totalUploaded} records (${applicants.length} applicants, ${interviews.length} interviews)`)
      setApplicants([])
      setInterviews([])
      setFile(null)
    } catch (err) {
      setError('Failed to upload data')
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
              Upload a CSV file containing either applicant data or interview data. The file should include headers for all required fields.
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

        {applicants.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-semibold text-gray-900">Preview ({applicants.length} applicants)</h3>
              <p className="text-gray-600 mt-2">
                Review the applicant data before uploading to the database.
              </p>
            </div>
            <div className="card-content">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seniority</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applicants.slice(0, 10).map((applicant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {applicant.applicant_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.full_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.role_title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.application_status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.seniority_level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {applicants.length > 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing first 10 of {applicants.length} applicants
                </p>
              )}

              <div className="mt-4">
                <button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="btn-primary w-full"
                >
                  {isUploading ? 'Uploading...' : `Upload ${applicants.length} Applicants`}
                </button>
              </div>
            </div>
          </div>
        )}

        {interviews.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-semibold text-gray-900">Preview ({interviews.length} interviews)</h3>
              <p className="text-gray-600 mt-2">
                Review the interview data before uploading to the database.
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
                    {interviews.slice(0, 10).map((interview, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {interview.applicant_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{interview.interviewer_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{interview.interview_timestamp_utc}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{interview.primary_language}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{interview.database_technology}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{interview.cloud_provider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {interviews.length > 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing first 10 of {interviews.length} interviews
                </p>
              )}

              <div className="mt-4">
                <button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="btn-primary w-full"
                >
                  {isUploading ? 'Uploading...' : `Upload ${interviews.length} Interviews`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
