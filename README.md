# AI Hiring Chat Bot

A Next.js 15 application that helps hiring staff evaluate candidates using AI-powered RAG (Retrieval-Augmented Generation) search. Upload candidate data via CSV and chat with an AI assistant to get insights about candidates.

## Features

- **CSV Upload**: Upload candidate interview data with automatic parsing and validation
- **AI RAG Chatbot**: Natural language queries about candidates using semantic search
- **Vector Search**: PostgreSQL with pgvector for efficient similarity search
- **Modern UI**: Clean, responsive interface built with custom Tailwind CSS
- **Real-time Chat**: Interactive chat interface with streaming responses

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS
- **UI**: Custom Tailwind CSS components
- **Database**: PostgreSQL with pgvector extension
- **AI**: OpenAI GPT-3.5-turbo + text-embedding-ada-002
- **Backend**: Next.js API routes, pg (PostgreSQL client)

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+ with pgvector extension (or Supabase account)
- OpenAI API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ai-hiring-chat-bot
npm install
```

### 2. Database Setup

#### Option A: Supabase (Recommended for production)

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database to find your connection string
4. Enable the pgvector extension in the SQL Editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

#### Option B: Local PostgreSQL

1. Install PostgreSQL and the pgvector extension:
   ```bash
   # On macOS with Homebrew
   brew install postgresql
   brew install pgvector
   
   # On Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   # Install pgvector from source or package manager
   ```

2. Create a database:
   ```sql
   CREATE DATABASE hiring_chatbot;
   ```

3. Enable the pgvector extension:
   ```sql
   \c hiring_chatbot
   CREATE EXTENSION vector;
   ```

### 3. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your configuration:

   **For Supabase:**
   ```env
   # Database Configuration
   SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   **For Local PostgreSQL:**
   ```env
   # Database Configuration
   POSTGRES_USER=your_username
   POSTGRES_HOST=localhost
   POSTGRES_DB=hiring_chatbot
   POSTGRES_PASSWORD=your_password
   POSTGRES_PORT=5432
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### 4. Database Schema Setup

Run the database setup script:
```bash
npm run db:setup
```

**Note:** If using Supabase, you can also run the SQL commands directly in the Supabase SQL Editor:
```sql
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
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### 1. Upload Candidate Data

1. Navigate to the Upload page
2. Select a CSV file with the following columns:
   - `applicant_id`
   - `interviewer_name`
   - `interview_timestamp_utc`
   - `professional_summary`
   - `primary_language`
   - `database_technology`
   - `cloud_provider`
   - `other_technologies`
   - `live_code_summary`

3. Review the preview table
4. Click "Upload" to save to database

### 2. Chat with AI Assistant

1. Navigate to the Chat page
2. Ask questions about candidates, such as:
   - "Find candidates with Python experience"
   - "Who interviewed candidates last week?"
   - "Show me candidates with AWS experience"
   - "Find candidates who performed well in live coding"

The AI will search through candidate data using semantic similarity and provide relevant responses.

## CSV Format Example

```csv
applicant_id,interviewer_name,interview_timestamp_utc,professional_summary,primary_language,database_technology,cloud_provider,other_technologies,live_code_summary
APP001,John Smith,2024-01-15T10:00:00Z,Experienced full-stack developer with 5 years in React and Node.js,Python,PostgreSQL,AWS,React,Node.js,TypeScript,Excellent problem-solving skills and clean code
APP002,Jane Doe,2024-01-16T14:30:00Z,Senior backend engineer specializing in microservices and cloud architecture,Java,MongoDB,GCP,Spring Boot,Docker,Kubernetes,Strong system design knowledge
```

## API Endpoints

### POST /api/upload
Upload candidate data from CSV.

**Request Body:**
```json
{
  "candidates": [
    {
      "applicant_id": "APP001",
      "interviewer_name": "John Smith",
      "interview_timestamp_utc": "2024-01-15T10:00:00Z",
      "professional_summary": "...",
      "primary_language": "Python",
      "database_technology": "PostgreSQL",
      "cloud_provider": "AWS",
      "other_technologies": "React,Node.js",
      "live_code_summary": "..."
    }
  ]
}
```

### POST /api/chat
Chat with AI assistant about candidates.

**Request Body:**
```json
{
  "message": "Find candidates with Python experience"
}
```

**Response:**
```json
{
  "response": "Based on the candidate data, I found 2 candidates with Python experience..."
}
```

## Database Schema

```sql
CREATE TABLE candidates (
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
```

## Development

### Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts
│   │   └── upload/route.ts
│   ├── chat/page.tsx
│   ├── upload/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── db.ts
├── scripts/
│   └── setup-db.js
└── package.json
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:setup` - Setup database schema

## Deployment

### Deploying with Supabase

1. **Setup Supabase Project:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Enable the pgvector extension in the SQL Editor
   - Run the database setup SQL commands

2. **Environment Variables:**
   - Set `SUPABASE_DB_URL` to your Supabase connection string
   - Set `OPENAI_API_KEY` to your OpenAI API key

3. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

4. **Configure Vercel Environment Variables:**
   - Go to your Vercel project settings
   - Add the environment variables from your `.env.local` file

### Deploying with Local PostgreSQL

Follow the same deployment steps but use the individual PostgreSQL environment variables instead of the Supabase URL.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
