import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  })
  return response.data[0].embedding
}

export async function POST(request: NextRequest) {
  try {
    const { candidates } = await request.json()

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json(
        { error: 'No candidates data provided' },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      for (const candidate of candidates) {
        // Generate embedding for professional summary
        const embedding = await generateEmbedding(candidate.professional_summary)

        // Insert candidate with embedding
        await client.query(
          `INSERT INTO candidates (
            applicant_id, interviewer_name, interview_timestamp_utc,
            professional_summary, primary_language, database_technology,
            cloud_provider, other_technologies, live_code_summary,
            professional_summary_embedding
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            candidate.applicant_id,
            candidate.interviewer_name,
            candidate.interview_timestamp_utc,
            candidate.professional_summary,
            candidate.primary_language,
            candidate.database_technology,
            candidate.cloud_provider,
            candidate.other_technologies,
            candidate.live_code_summary,
            JSON.stringify(embedding),
          ]
        )
      }

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        message: `Successfully uploaded ${candidates.length} candidates`,
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
      { error: 'Failed to upload candidates' },
      { status: 500 }
    )
  }
}
