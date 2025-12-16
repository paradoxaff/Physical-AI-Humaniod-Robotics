# Quickstart Guide: Physical AI & Humanoid Robotics Textbook

## Getting Started

This guide will help you set up the development environment for the Physical AI & Humanoid Robotics textbook project.

### Prerequisites

- Node.js 18+ (for Docusaurus)
- Python 3.11+ (for backend services)
- Git
- Access to OpenAI API (for RAG features)
- Access to Qdrant Cloud (for vector storage)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   QDRANT_URL=your_qdrant_cluster_url
   QDRANT_API_KEY=your_qdrant_api_key
   DATABASE_URL=your_neon_postgres_connection_string
   BETTER_AUTH_SECRET=your_auth_secret
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Install backend dependencies**
   ```bash
   cd api
   pip install -r requirements.txt
   ```

5. **Start the development servers**
   - Terminal 1 (Docusaurus frontend):
     ```bash
     npm start
     ```
   - Terminal 2 (FastAPI backend):
     ```bash
     cd api
     uvicorn src.main:app --reload --port 8000
     ```

6. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API docs: http://localhost:8000/docs
   - Backend API: http://localhost:8000/api/

### Project Structure

```
.
├── docs/                    # Textbook content
│   ├── modules/            # Course modules
│   ├── hardware/           # Hardware documentation
│   └── ...
├── src/                   # Docusaurus custom components
├── api/                   # FastAPI backend
│   ├── src/
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic
│   └── requirements.txt
├── static/                # Static assets
├── docusaurus.config.js   # Docusaurus configuration
└── package.json          # Frontend dependencies
```

### Adding New Content

1. **Create a new module**:
   ```bash
   mkdir docs/modules/module-XX-module-name
   ```

2. **Add lessons following the template**:
   Each lesson should include:
   - Learning Objectives
   - Physical AI Concept
   - System Architecture (textual diagram)
   - Tools & Software
   - Code / Configuration Examples
   - Practical Lab / Simulation
   - Real-World Mapping
   - Summary

3. **Update sidebar configuration** in `sidebars.js`

### Running Tests

- Frontend tests: `npm test`
- Backend tests: `cd api && pytest tests/`

### Deployment

The application can be deployed to Vercel or GitHub Pages for the frontend, with the backend deployed to a cloud provider that supports Python applications.

### Troubleshooting

- **Docusaurus build errors**: Ensure all Markdown files have proper frontmatter
- **API connection issues**: Verify environment variables are set correctly
- **RAG functionality not working**: Check OpenAI and Qdrant API keys