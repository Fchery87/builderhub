# BuilderHub - AI-Powered Project Management for Development Teams

AI-powered task board and project management system for team collaboration and sprint management with real-time synchronization.

## Features

- **Real-time Collaboration**: Instant updates across all connected team members
- **AI Integration**: Automatically generate acceptance criteria with Gemini API
- **Role-based Access**: Secure permissions for developers, managers, and QA teams
- **High Performance**: Sub-500ms response times for all operations
- **Modern UI**: Professional design with dark mode support using Shadcn/ui components
- **Modern Stack**: Next.js, FastAPI, InstantDB, and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: FastAPI, Python
- **Database/Auth**: InstantDB
- **AI**: Gemini 2.5 Flash/Pro APIs
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- InstantDB account and app ID
- Gemini API key

### Installation

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Fill in your environment variables in `.env`:
   - `INSTANTDB_APP_ID`: Your InstantDB app ID
   - `INSTANTDB_ADMIN_TOKEN`: Your InstantDB admin token
   - `GEMINI_API_KEY`: Your Gemini API key

4. Install dependencies:
   ```bash
   npm run install:all
   ```

### Development

Start both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Individual Services

Start only the frontend:
```bash
npm run dev:frontend
```

Start only the backend:
```bash
npm run dev:backend
```

## Project Structure

```
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/ # Reusable React components
│   │   └── lib/       # Utility functions and configurations
│   ├── package.json
│   └── tailwind.config.js
├── backend/           # FastAPI backend application
│   ├── main.py        # Main FastAPI application
│   ├── requirements.txt
│   └── app/           # Application modules
├── artifacts/         # SDD workflow artifacts
└── prompts/           # Agent instruction prompts
```

## API Documentation

When the backend is running, visit http://localhost:8000/docs for interactive API documentation.

## Contributing

This project follows a Spec-Driven Development (SDD) workflow. See the `artifacts/` directory for architectural decisions and implementation tasks.

## License

MIT
