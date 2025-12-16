from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import asyncio
import logging
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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

# Mock RAG service (in real implementation, this would connect to Qdrant/PostgreSQL)
class RAGService:
    def __init__(self):
        self.documents = []
        self.embeddings_ready = False

    async def initialize(self):
        """Initialize the RAG service and load documents"""
        logger.info("Initializing RAG service...")
        # In a real implementation, this would:
        # 1. Connect to Qdrant for vector storage
        # 2. Connect to PostgreSQL for metadata
        # 3. Load documents from Docusaurus markdown files
        # 4. Generate embeddings and store in Qdrant
        await self._load_documents()
        self.embeddings_ready = True
        logger.info("RAG service initialized successfully")

    async def _load_documents(self):
        """Load documents from Docusaurus content directory"""
        # This is a mock implementation
        # In real implementation, scan docs/ directory and load all markdown files
        mock_docs = [
            {
                "id": "module1_intro",
                "content": "Module 1: The Robotic Nervous System (ROS 2). This module covers the fundamentals of Robot Operating System 2, including nodes, topics, services, and actions.",
                "metadata": {"module": "1", "section": "introduction", "file": "module-01-ros2/index.mdx"}
            },
            {
                "id": "ros2_foundations",
                "content": "Chapter 1: ROS 2 Foundations. This chapter covers the core concepts of ROS 2, including the architecture, node-topic-service pattern, and basic communication patterns.",
                "metadata": {"module": "1", "chapter": "1", "file": "module-01-ros2/ros2-foundations.mdx"}
            },
            {
                "id": "gazebo_simulation",
                "content": "Module 2: Simulation Environments (Gazebo & Unity). This module covers physics-based simulation environments for robotics, including Gazebo and Unity integration.",
                "metadata": {"module": "2", "section": "introduction", "file": "module-02-gazebo-unity/index.mdx"}
            },
            {
                "id": "nvidia_isaac",
                "content": "Module 3: NVIDIA Isaac. This module covers NVIDIA's robotics platform including Isaac Sim, Isaac ROS, and GPU-accelerated robotics applications.",
                "metadata": {"module": "3", "section": "introduction", "file": "module-03-isaac/index.mdx"}
            },
            {
                "id": "vla_capstone",
                "content": "Module 4: Vision-Language-Action and Capstone. This module covers multimodal AI systems integrating vision, language, and action for humanoid robotics.",
                "metadata": {"module": "4", "section": "introduction", "file": "module-04-vla-capstone/index.mdx"}
            }
        ]

        for doc in mock_docs:
            self.documents.append(DocumentChunk(**doc))

        logger.info(f"Loaded {len(mock_docs)} documents")

    async def query(self, query_text: str, context_mode: str = "full_book", selected_text: Optional[str] = None) -> Dict[str, Any]:
        """Query the RAG system for a response"""
        if not self.embeddings_ready:
            raise HTTPException(status_code=503, detail="RAG service not ready")

        # In a real implementation, this would:
        # 1. Generate embedding for the query
        # 2. Search Qdrant for relevant chunks
        # 3. Generate response using the retrieved context

        # Mock response generation
        if context_mode == "selected_text" and selected_text:
            response = f"Based on the selected text: '{selected_text[:100]}...', I can provide more detailed information about this specific concept. In a real implementation, this would use the selected text as the primary context for generating a precise answer."
            sources = ["selected_text_context"]
            confidence = 0.9
        else:
            # Search through documents for relevant information
            relevant_docs = []
            query_lower = query_text.lower()

            for doc in self.documents:
                if query_lower in doc.content.lower():
                    relevant_docs.append(doc.metadata.get("file", "unknown"))

            if relevant_docs:
                response = f"Based on the textbook content, I found information in: {', '.join(relevant_docs[:3])}. In a real implementation, this would provide a detailed answer using the retrieved context from the Physical AI & Humanoid Robotics textbook."
                sources = relevant_docs[:3]
                confidence = 0.85
            else:
                response = f"I found this question interesting: '{query_text}'. While I don't have specific information in the current context, the Physical AI & Humanoid Robotics textbook covers advanced topics in robotics, AI, and embodied intelligence. In a real implementation, I would search the entire book for relevant information."
                sources = []
                confidence = 0.6

        return {
            "response": response,
            "sources": sources,
            "confidence": confidence,
            "context_used": context_mode
        }

# Initialize RAG service
rag_service = RAGService()

@app.on_event("startup")
async def startup_event():
    """Initialize the RAG service on startup"""
    await rag_service.initialize()

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

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "embeddings_ready": rag_service.embeddings_ready
    }

@app.get("/documents")
async def get_documents():
    """Get list of indexed documents"""
    return {
        "count": len(rag_service.documents),
        "documents": [
            {
                "id": doc.id,
                "file": doc.metadata.get("file", "unknown"),
                "module": doc.metadata.get("module", "unknown")
            }
            for doc in rag_service.documents
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)