# AI Resume Analyzer

An elegant, AI-powered web application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Get instant insights on ATS compatibility, keyword matching, and actionable improvement suggestions.

## Features

### Core Functionality

- **Resume Upload** — Support for PDF and DOCX formats with automatic text extraction
- **ATS Compatibility Scoring** — AI-powered analysis that evaluates your resume against ATS criteria
- **Keyword Matching** — Compare your resume keywords against job requirements and identify gaps
- **AI Improvement Suggestions** — Get actionable, specific recommendations to optimize your resume
- **Analysis History** — Track and revisit all past analyses over time
- **Secure Cloud Storage** — Uploaded resumes are securely stored for re-analysis without re-uploading

### Design Philosophy

The application features an elegant, premium design with:

- Refined typography and carefully chosen color palette
- Clear visual hierarchy and professional layout
- Smooth interactions and micro-animations
- Responsive design for all devices
- Accessible UI with proper contrast and keyboard navigation

## Tech Stack

### Frontend
- **React 19** — Modern UI library
- **Tailwind CSS 4** — Utility-first styling
- **TypeScript** — Type-safe development
- **tRPC** — End-to-end type-safe APIs
- **Wouter** — Lightweight routing

### Backend
- **Express.js** — Web server framework
- **Node.js** — Runtime environment
- **tRPC** — Type-safe RPC framework
- **Drizzle ORM** — Database access layer
- **MySQL/TiDB** — Database

### AI & Processing
- **Manus LLM API** — AI-powered analysis and suggestions
- **Mammoth** — DOCX parsing
- **Custom PDF parsing** — PDF text extraction

### Authentication
- **Manus OAuth** — Secure user authentication

## Getting Started

### Prerequisites

- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL or TiDB database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-resume-analyzer
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create .env file with required variables
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=your_oauth_url
```

4. Run database migrations:
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
ai-resume-analyzer/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and helpers
│   │   └── index.css      # Global styles
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── routers.ts         # tRPC procedure definitions
│   ├── db.ts              # Database query helpers
│   ├── fileParser.ts      # Resume file parsing
│   ├── analysisService.ts # AI analysis logic
│   └── _core/             # Framework internals
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
└── storage/               # S3 storage helpers
```

## Key Features Implementation

### Resume Upload & Parsing
- Accepts PDF and DOCX files up to 10MB
- Automatic text extraction from uploaded documents
- Secure cloud storage with signed URLs for re-analysis

### ATS Analysis
- Evaluates resume format, structure, and content
- Scores against established ATS criteria (0-100)
- Identifies formatting issues that may confuse ATS systems
- Provides specific recommendations for improvement

### Keyword Matching
- Extracts keywords from job descriptions
- Compares against resume content
- Calculates match percentage
- Highlights both matched and missing keywords

### AI Suggestions
- Generates actionable improvement recommendations
- Prioritizes suggestions by impact (high, medium, low)
- Provides specific examples and context
- Covers formatting, content, and keyword optimization

## API Endpoints

### Resume Analysis
- `POST /api/trpc/resume.uploadAndAnalyze` — Upload resume and analyze
- `GET /api/trpc/analysis.list` — Get analysis history
- `GET /api/trpc/analysis.getById` — Get specific analysis

### Authentication
- `POST /api/trpc/auth.logout` — Logout current user
- `GET /api/trpc/auth.me` — Get current user info

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Code Quality
```bash
pnpm format
pnpm check
```

## Deployment

The application is built for Manus hosting with:
- Autoscale (serverless) deployment by default
- Support for custom domains
- Automatic SSL certificates
- Built-in analytics and monitoring

To deploy, click the "Publish" button in the Manus Management UI after creating a checkpoint.

## Database Schema

### Users Table
- `id` — Primary key
- `openId` — Manus OAuth identifier
- `name` — User name
- `email` — User email
- `role` — User role (user/admin)
- `createdAt` — Account creation timestamp
- `updatedAt` — Last update timestamp

### Resumes Table
- `id` — Primary key
- `userId` — Reference to user
- `fileName` — Original file name
- `fileType` — File type (pdf/docx)
- `fileKey` — S3 storage key
- `resumeText` — Extracted text content
- `createdAt` — Upload timestamp

### Analyses Table
- `id` — Primary key
- `userId` — Reference to user
- `resumeId` — Reference to resume
- `jobDescription` — Pasted job description
- `atsScore` — ATS compatibility score (0-100)
- `keywordMatchPercentage` — Keyword match percentage
- `matchedKeywords` — JSON array of matched keywords
- `missingKeywords` — JSON array of missing keywords
- `improvementSuggestions` — JSON array of suggestions
- `createdAt` — Analysis timestamp

## Performance Considerations

- Resume text extraction is performed server-side for security
- Analysis results are cached in the database for quick retrieval
- File storage uses S3 for scalability and reliability
- Database queries are optimized with proper indexing
- Frontend uses React Query for efficient data management

## Security

- All user data is encrypted in transit (HTTPS)
- Uploaded files are scanned and validated before processing
- Database connections use secure credentials
- OAuth authentication prevents unauthorized access
- User sessions are managed securely with JWT tokens

## Future Enhancements

- Support for additional file formats (RTF, ODT)
- Resume templates and formatting suggestions
- Integration with job boards for direct comparison
- Batch resume analysis
- Resume version comparison and tracking
- Export analysis results as PDF
- Mobile app for iOS and Android

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Write tests for new functionality
4. Submit a pull request with a description of changes

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or feedback, please contact the development team or submit an issue on GitHub.

## Acknowledgments

- Built with [Manus](https://manus.im) — AI-powered development platform
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)

---

**Made with ❤️ for job seekers everywhere**
