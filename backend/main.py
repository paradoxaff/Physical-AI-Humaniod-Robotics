from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from typing import List, Optional, Dict, Any
import asyncio
from contextlib import asynccontextmanager

from services.rag_service import RAGService
from services.vector_db import DocumentChunk
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class ChatMode(str, Enum):
    FULL_BOOK = "full_book"
    SELECTED_TEXT_ONLY = "selected_text_only"


class ChatRequest(BaseModel):
    query: str
    context_page: Optional[str] = None
    selected_text: Optional[str] = None
    mode: ChatMode = ChatMode.FULL_BOOK


class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = None
    confidence: Optional[float] = None
    context_used: Optional[str] = None

# Initialize RAG service globally
rag_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize resources on startup"""
    global rag_service
    rag_service = RAGService()

    # Initialize the RAG service
    await rag_service.initialize()

    # Index existing documents on startup to make them available for chat
    await rag_service.index_documents("../docs")  # Pointing to the main docs directory with your book content

    yield

    # Cleanup on shutdown
    if rag_service:
        await rag_service.close()

app = FastAPI(
    title="Physical AI & Humanoid Robotics RAG API",
    description="API for RAG chatbot serving Physical AI & Humanoid Robotics textbook content",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Physical AI & Humanoid Robotics RAG API is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint that processes user queries against the RAG system
    """
    try:
        # Map the request mode to the RAG service context mode
        context_mode = "full_book" if request.mode == ChatMode.FULL_BOOK else "selected_text"

        result = await rag_service.query(
            query_text=request.query,
            context_mode=context_mode,
            selected_text=request.selected_text
        )

        return ChatResponse(
            response=result["response"],
            sources=result.get("sources"),
            confidence=result.get("confidence"),
            context_used=result.get("context_used")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/index-documents")
async def index_documents(background_tasks: BackgroundTasks):
    """
    Endpoint to trigger document indexing from the docs directory
    """
    try:
        # Run indexing in background to avoid blocking
        background_tasks.add_task(rag_service.index_documents, "../docs")
        return {"status": "indexing started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)