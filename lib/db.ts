import { Pool } from 'pg'

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

export default pool
