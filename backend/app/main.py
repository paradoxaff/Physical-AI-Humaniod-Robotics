from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio
import logging
from .services.rag_service import RAGService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Physical AI & Humanoid Robotics RAG API",
    description="RAG system for Physical AI & Humanoid Robotics textbook",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG service
rag_service = RAGService()

# Request/Response models
class Message(BaseModel):
    role: str = Field(..., description="Role of the message sender (user or assistant)")
    content: str = Field(..., description="Content of the message")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    messages: List[Message] = Field(..., description="List of messages in the conversation")
    context_mode: str = Field(default="full_book", description="Context mode: 'full_book' or 'selected_text'")
    selected_text: Optional[str] = Field(None, description="Selected text for context (if applicable)")
    temperature: float = Field(default=0.7, ge=0.0, le=1.0, description="Temperature for response generation")

class ChatResponse(BaseModel):
    response: str = Field(..., description="Generated response")
    sources: List[str] = Field(default=[], description="Sources used for response")
    confidence: float = Field(..., description="Confidence score for the response")
    context_used: str = Field(..., description="Context mode used for response")

class DocumentChunk(BaseModel):
    id: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[List[float]] = None

@app.on_event("startup")
async def startup_event():
    """Initialize the RAG service on startup"""
    logger.info("Initializing RAG service...")
    await rag_service.initialize()
    logger.info("RAG service initialized successfully")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Physical AI & Humanoid Robotics RAG API", "status": "ready"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Chat endpoint that processes user queries using RAG"""
    try:
        # Get the last user message
        if not request.messages:
            raise HTTPException(status_code=400, detail="No messages provided")

        last_message = request.messages[-1]
        if last_message.role != "user":
            raise HTTPException(status_code=400, detail="Last message must be from user")

        # Query the RAG system
        result = await rag_service.query(
            query_text=last_message.content,
            context_mode=request.context_mode,
            selected_text=request.selected_text
        )

        return ChatResponse(
            response=result["response"],
            sources=result["sources"],
            confidence=result["confidence"],
            context_used=result["context_used"]
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/index-documents")
async def index_documents_endpoint(document_path: str):
    """Endpoint to index documents from a directory"""
    try:
        success = await rag_service.index_documents(document_path)

        if success:
            return {"message": f"Successfully indexed documents from {document_path}", "status": "success"}
        else:
            raise HTTPException(status_code=500, detail="Failed to index documents")

    except Exception as e:
        logger.error(f"Error indexing documents: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error indexing documents: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    health_status = await rag_service.health_check()
    return health_status

@app.get("/documents/count")
async def get_document_count():
    """Get the total number of indexed documents"""
    count = await rag_service.get_document_count()
    return {"count": count}

# Additional utility endpoints
@app.get("/capabilities")
async def get_capabilities():
    """Get information about RAG system capabilities"""
    return {
        "capabilities": [
            "Full-book question answering",
            "Selected text mode",
            "Context-aware responses",
            "Source attribution",
            "Confidence scoring"
        ],
        "supported_context_modes": ["full_book", "selected_text"],
        "model_info": {
            "embedding_model": "all-MiniLM-L6-v2",
            "vector_db": "Qdrant",
            "max_context_length": "variable based on retrieved chunks"
        }
    }

@app.put("/documents/{chunk_id}")
async def update_document_chunk(chunk_id: str, content: str, metadata: Dict[str, Any]):
    """Update a specific document chunk"""
    try:
        success = await rag_service.update_document(chunk_id, content, metadata)

        if success:
            return {"message": f"Successfully updated document chunk {chunk_id}", "status": "success"}
        else:
            raise HTTPException(status_code=404, detail=f"Document chunk {chunk_id} not found")

    except Exception as e:
        logger.error(f"Error updating document chunk: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating document chunk: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)