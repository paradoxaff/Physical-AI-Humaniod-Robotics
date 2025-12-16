# Physical AI & Humanoid Robotics - AI-Native Textbook

This is an AI-native textbook platform for "Physical AI & Humanoid Robotics" featuring a RAG-powered chatbot that answers questions based on the textbook content.

## 🏗️ Architecture Overview

### Backend (FastAPI)
- **API Server**: FastAPI server with async support
- **Vector Database**: Qdrant for efficient similarity search
- **Embeddings**: Sentence Transformers for document encoding
- **Document Processing**: Markdown parsing and intelligent chunking
- **RAG Service**: Retrieval-Augmented Generation pipeline

### Frontend (Docusaurus)
- **Framework**: Docusaurus v2 with custom theme
- **Styling**: Dark mode with neon blue/cyan/purple theme
- **Chatbot**: Floating RAG-powered AI assistant
- **AI Features**: Context awareness, selected text grounding, content personalization

## 🚀 How to Run

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Qdrant (can run locally or use cloud)

### 1. Install Qdrant (Vector Database)
```bash
# Option A: Run locally with Docker
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant

# Option B: Use Qdrant Cloud (requires account setup)
# Visit: https://cloud.qdrant.io/
```

### 2. Setup Backend
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the backend server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Setup Frontend
```bash
cd physical-ai-website

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Index Documents
```bash
# In a separate terminal, after backend is running
curl -X POST http://localhost:8000/index-documents
```

## 🎨 AI-Native Features

### 1. Context-Aware Chatbot
- **Floating Widget**: Accessible from any page via the 🤖 button
- **Page Context**: Automatically uses current page as context
- **Selected Text Mode**: Answers questions based on selected text only

### 2. Header AI Buttons
- **🤖 Ask AI**: Opens chatbot with current page context
- **🌐 Translate to Urdu**: Translation functionality
- **🎯 Personalize Content**: User-specific content adaptation

### 3. Visual Design
- **Dark Theme**: Default dark mode for comfortable reading
- **AI Colors**: Neon blue (#00f7ff), cyan, and purple accents
- **Robot Logo**: Custom SVG robot icon in navbar
- **Wide Reading Layout**: Optimized for textbook content

## 🤖 API Endpoints

### Chat API
```
POST /chat
{
  "query": "Your question here",
  "context_page": "/docs/intro",  // Optional
  "selected_text": "Selected text",  // Optional
  "mode": "full_book"  // or "selected_text_only"
}
```

### Index Documents
```
POST /index-documents
```

### Health Check
```
GET /health
```

## 📚 Document Processing

The system automatically:
- Parses Markdown files from the `docs/` directory
- Chunks documents intelligently (by headings, paragraphs)
- Generates embeddings for semantic search
- Stores in Qdrant vector database

## 🔧 Configuration

### Backend Configuration
- **Qdrant Connection**: Update in `services/vector_db.py`
- **Embedding Model**: Configurable in `services/vector_db.py`
- **Chunk Size**: Adjustable in `services/document_processor.py`

### Frontend Configuration
- **API Endpoint**: Update in `src/components/AIChatbot.jsx`
- **Styling**: Custom CSS in `src/css/custom.css`
- **Theme**: Color variables in CSS file

## 🛠️ Development

### Running in Development Mode
1. Start Qdrant locally
2. Run backend with hot reload: `python -m uvicorn main:app --reload`
3. Run frontend with hot reload: `npm start`
4. Index documents: `curl -X POST http://localhost:8000/index-documents`

### Adding New Content
1. Add new Markdown files to `physical-ai-website/docs/`
2. Re-index: `curl -X POST http://localhost:8000/index-documents`
3. The new content will be searchable by the AI

## 📋 File Structure

```
project/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main API server
│   ├── services/           # Business logic
│   │   ├── rag_service.py
│   │   ├── vector_db.py
│   │   └── document_processor.py
│   └── models/             # Data models
├── physical-ai-website/    # Docusaurus frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── AIChatbot.jsx
│   │   ├── theme/          # Docusaurus theme overrides
│   │   └── utils/          # Utility functions
│   ├── docs/               # Textbook content
│   └── static/             # Static assets
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.