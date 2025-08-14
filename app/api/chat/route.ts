import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  })
  return response.data[0].embedding
}

async function searchInterviews(query: string, limit: number = 5) {
  const queryEmbedding = await generateEmbedding(query)
  
  const client = await pool.connect()
  try {
    const result = await client.query(
      `SELECT 
        i.applicant_id,
        a.full_name,
        a.email,
        a.role_title,
        a.project_name,
        a.application_status,
        a.seniority_level,
        a.applicant_alias,
        i.interviewer_name,
        i.interview_timestamp_utc,
        i.professional_summary,
        i.primary_language,
        i.database_technology,
        i.cloud_provider,
        i.other_technologies,
        i.live_code_summary,
        1 - (i.professional_summary_embedding <=> $1) as similarity
      FROM interviews i
      LEFT JOIN applicants a ON i.applicant_id = a.applicant_id
      ORDER BY i.professional_summary_embedding <=> $1
      LIMIT $2`,
      [JSON.stringify(queryEmbedding), limit]
    )
    
    return result.rows
  } finally {
    client.release()
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Search for relevant interviews
    const relevantInterviews = await searchInterviews(message, 5)

    if (relevantInterviews.length === 0) {
      return NextResponse.json({
        response: "I don't have any interview data to search through. Please upload some applicant and interview data first using the upload page."
      })
    }

    // Create context from relevant interviews
    const context = relevantInterviews.map((interview: any, index: number) => `
Candidate ${index + 1}:
- Applicant ID: ${interview.applicant_id}
- Full Name: ${interview.full_name || 'N/A'}
- Email: ${interview.email || 'N/A'}
- Role Title: ${interview.role_title || 'N/A'}
- Project: ${interview.project_name || 'N/A'}
- Status: ${interview.application_status || 'N/A'}
- Seniority: ${interview.seniority_level || 'N/A'}
- Alias: ${interview.applicant_alias || 'N/A'}
- Interviewer: ${interview.interviewer_name}
- Interview Date: ${interview.interview_timestamp_utc}
- Primary Language: ${interview.primary_language}
- Database Technology: ${interview.database_technology}
- Cloud Provider: ${interview.cloud_provider}
- Other Technologies: ${interview.other_technologies}
- Professional Summary: ${interview.professional_summary}
- Live Code Summary: ${interview.live_code_summary}
- Relevance Score: ${(interview.similarity * 100).toFixed(1)}%
`).join('\n\n')

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI hiring assistant that helps evaluate candidates. You have access to candidate data from interviews and professional summaries. 

When responding to questions:
1. Use the provided candidate context to answer questions accurately
2. Be specific about which candidates match the criteria
3. Include relevant details like skills, experience, and interview performance
4. If no candidates match the criteria, clearly state that
5. Format your response in a clear, professional manner
6. Include the relevance scores to show confidence in matches

Available candidate data includes: applicant ID, interviewer name, interview date, primary language, database technology, cloud provider, other technologies, professional summary, and live code summary.`
        },
        {
          role: 'user',
          content: `Based on the following candidate data, please answer this question: "${message}"

Candidate Data:
${context}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
