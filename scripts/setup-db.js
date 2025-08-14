const { Pool } = require('pg')

// Support both Supabase URL and individual connection parameters
const getPoolConfig = () => {
  // If SUPABASE_DB_URL is provided, use it
  if (process.env.SUPABASE_DB_URL) {
    return {
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  }

  // Fallback to individual parameters
  return {
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'hiring_chatbot',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
  }
}

const pool = new Pool(getPoolConfig())

async function setupDatabase() {
  try {
    console.log('Setting up database...')
    
    // Create the candidates table with pgvector support
    const createTableQuery = `
      CREATE EXTENSION IF NOT EXISTS vector;
      
      CREATE TABLE IF NOT EXISTS candidates (
        id SERIAL PRIMARY KEY,
        applicant_id VARCHAR(255) NOT NULL,
        interviewer_name VARCHAR(255) NOT NULL,
        interview_timestamp_utc TIMESTAMP NOT NULL,
        professional_summary TEXT NOT NULL,
        primary_language VARCHAR(100),
        database_technology VARCHAR(100),
        cloud_provider VARCHAR(100),
        other_technologies TEXT,
        live_code_summary TEXT,
        professional_summary_embedding vector(1536),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS candidates_applicant_id_idx ON candidates(applicant_id);
      CREATE INDEX IF NOT EXISTS candidates_interviewer_name_idx ON candidates(interviewer_name);
      CREATE INDEX IF NOT EXISTS candidates_interview_timestamp_idx ON candidates(interview_timestamp_utc);
    `
    
    await pool.query(createTableQuery)
    console.log('Database setup completed successfully!')
    
  } catch (error) {
    console.error('Error setting up database:', error)
  } finally {
    await pool.end()
  }
}

setupDatabase()
