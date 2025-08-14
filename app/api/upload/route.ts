import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  })
  return response.data[0].embedding
}

export async function POST(request: NextRequest) {
  try {
    const { applicants, interviews } = await request.json()

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Upload applicants if provided
      if (Array.isArray(applicants) && applicants.length > 0) {
        for (const applicant of applicants) {
          await client.query(
            `INSERT INTO applicants (
              applicant_id, full_name, email, role_title, project_name,
              application_status, seniority_level, applicant_alias
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (applicant_id) DO UPDATE SET
              full_name = EXCLUDED.full_name,
              email = EXCLUDED.email,
              role_title = EXCLUDED.role_title,
              project_name = EXCLUDED.project_name,
              application_status = EXCLUDED.application_status,
              seniority_level = EXCLUDED.seniority_level,
              applicant_alias = EXCLUDED.applicant_alias`,
            [
              applicant.applicant_id,
              applicant.full_name,
              applicant.email,
              applicant.role_title,
              applicant.project_name,
              applicant.application_status,
              applicant.seniority_level,
              applicant.applicant_alias,
            ]
          )
        }
        console.log(`Uploaded ${applicants.length} applicants`)
      }

      // Upload interviews if provided
      if (Array.isArray(interviews) && interviews.length > 0) {
        for (const interview of interviews) {
          // Generate embedding for professional summary
          const embedding = await generateEmbedding(interview.professional_summary)

          await client.query(
            `INSERT INTO interviews (
              applicant_id, interviewer_name, interview_timestamp_utc,
              professional_summary, primary_language, database_technology,
              cloud_provider, other_technologies, live_code_summary,
              professional_summary_embedding
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              interview.applicant_id,
              interview.interviewer_name,
              interview.interview_timestamp_utc,
              interview.professional_summary,
              interview.primary_language,
              interview.database_technology,
              interview.cloud_provider,
              interview.other_technologies,
              interview.live_code_summary,
              JSON.stringify(embedding),
            ]
          )
        }
        console.log(`Uploaded ${interviews.length} interviews`)
      }

      await client.query('COMMIT')

      const totalUploaded = (applicants?.length || 0) + (interviews?.length || 0)
      return NextResponse.json({
        success: true,
        message: `Successfully uploaded ${totalUploaded} records`,
        applicants: applicants?.length || 0,
        interviews: interviews?.length || 0,
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload data' },
      { status: 500 }
    )
  }
}
