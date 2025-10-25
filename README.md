# Forensic OSINT Report Generator

A full-stack web application for generating comprehensive forensic Open-Source Intelligence (OSINT) investigation reports. This application provides a professional, dark-themed interface for managing investigation cases, entities, theories, and generating detailed Markdown reports with Maltego-style entity mapping.

## Features

- **Case Management**: Create and manage forensic investigation cases with detailed metadata
- **Entity Mapping**: Track people, locations, companies, and other entities related to cases
- **Theory Analysis**: Document investigative theories with probability assessments and verification formulas
- **Timeline Management**: Build chronological timelines of events
- **Report Generation**: Automatically generate comprehensive Markdown reports with:
  - Executive summaries
  - Case timelines
  - Entity maps
  - Relationship analysis
  - Probability assessments
  - Maltego-style graph data (JSON format)
- **Webhook Integration**: Accept case data from external sources via REST API
- **Dark Theme UI**: Professional black background with silver text, optimized for extended investigation work

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth
- **Deployment**: Manus Platform

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- pnpm package manager
- MySQL database (or TiDB)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/forensic-osint-report-generator.git
   cd forensic-osint-report-generator
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables (see Environment Variables section)

4. Push database schema:
   ```bash
   pnpm db:push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open your browser to `http://localhost:3000`

### Environment Variables

The following environment variables are automatically configured when deployed on the Manus Platform:

- `DATABASE_URL`: MySQL/TiDB connection string
- `JWT_SECRET`: Session cookie signing secret
- `VITE_APP_ID`: Manus OAuth application ID
- `OAUTH_SERVER_URL`: Manus OAuth backend base URL
- `VITE_OAUTH_PORTAL_URL`: Manus login portal URL
- `OWNER_OPEN_ID`, `OWNER_NAME`: Owner's information
- `VITE_APP_TITLE`: Application title
- `VITE_APP_LOGO`: Logo image URL
- `BUILT_IN_FORGE_API_URL`: Manus built-in APIs
- `BUILT_IN_FORGE_API_KEY`: Bearer token for Manus APIs

## Usage

### Creating a Case

1. Click "New Case" on the dashboard
2. Fill in the case details:
   - Case Title
   - Subject (person or entity being investigated)
   - Date of Incident
   - Location
   - Description
3. Click "Create Case"

### Adding Entities

1. Open a case
2. Navigate to the "Entities" tab
3. Add entities such as:
   - People involved
   - Locations
   - Companies
   - Disposal sites
   - Exit routes

### Creating Theories

1. Open a case
2. Navigate to the "Theories" tab
3. Document investigative theories with:
   - Title
   - Description
   - Probability (0-100%)
   - Verification formula
   - Status (pending, verified, eliminated)

### Generating Reports

1. Open a case
2. Click "Generate Report"
3. View the generated report in the "Reports" tab
4. Download the report as a Markdown file

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed information about:

- Webhook endpoints
- tRPC API procedures
- Data models
- Integration examples
- Security considerations

## Webhook Integration

The application provides webhook endpoints for external data integration:

### Create Case via Webhook

```bash
POST /api/webhook/case
Content-Type: application/json

{
  "userId": 1,
  "title": "Investigation Case",
  "subject": "Subject Name",
  "description": "Case description",
  "entities": [...],
  "theories": [...],
  "timelineEvents": [...]
}
```

See the full API documentation for complete webhook specifications.

## Project Structure

```
forensic_osint_report_generator/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/         # tRPC client and utilities
│   │   └── App.tsx      # Main application component
├── server/              # Backend Express application
│   ├── _core/          # Core server infrastructure
│   ├── db.ts           # Database query helpers
│   ├── routers.ts      # tRPC procedures
│   ├── reportGenerator.ts  # Report generation logic
│   └── webhookRouter.ts    # Webhook endpoints
├── drizzle/            # Database schema and migrations
│   └── schema.ts       # Database table definitions
├── shared/             # Shared constants and types
└── todo.md            # Project task tracking
```

## Development Workflow

1. **Update Schema**: Modify `drizzle/schema.ts` and run `pnpm db:push`
2. **Add Database Helpers**: Create query functions in `server/db.ts`
3. **Create tRPC Procedures**: Add procedures in `server/routers.ts`
4. **Build Frontend**: Use tRPC hooks in React components

## Security Considerations

- All case data is user-scoped (users can only access their own cases)
- Authentication is handled via Manus OAuth
- Webhook endpoints should be secured with API keys in production
- All database queries use parameterized statements to prevent SQL injection

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions, issues, or feature requests, please open an issue on GitHub.

## Acknowledgments

- Built with the Manus Platform
- UI components from shadcn/ui
- Inspired by real-world forensic OSINT investigation workflows

---

**Note**: This application is designed for legitimate forensic investigation and OSINT research purposes. Users are responsible for ensuring their use complies with all applicable laws and regulations.

