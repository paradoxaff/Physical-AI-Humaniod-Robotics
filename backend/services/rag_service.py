import asyncio
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path
import numpy as np
from sentence_transformers import util
from .document_processor import DocumentProcessor
from .vector_db import VectorDBService, DocumentChunk

logger = logging.getLogger(__name__)

class RAGService:
    """Retrieval-Augmented Generation service for Physical AI textbook"""

    def __init__(self,
                 vector_db_host: str = "localhost",
                 vector_db_port: int = 6333,
                 collection_name: str = "physical_ai_docs",
                 use_memory_storage: bool = True):

        self.vector_db = VectorDBService(
            host=vector_db_host,
            port=vector_db_port,
            collection_name=collection_name,
            use_memory_storage=use_memory_storage
        )
        self.document_processor = DocumentProcessor()
        self.initialized = False

    async def initialize(self):
        """Initialize the RAG service"""
        try:
            await self.vector_db.initialize()
            self.initialized = True
            logger.info("RAG service initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing RAG service: {str(e)}")
            raise

    async def index_documents(self, document_directory: str) -> bool:
        """Process and index documents from a directory"""
        if not self.initialized:
            raise RuntimeError("RAG service not initialized")

        try:
            logger.info(f"Processing documents from: {document_directory}")

            # Process documents into chunks
            chunks = await self.document_processor.process_document_directory(document_directory)

            logger.info(f"Processed {len(chunks)} document chunks")

            # Store in vector database
            success = await self.vector_db.store_documents(chunks)

            if success:
                logger.info(f"Successfully indexed {len(chunks)} chunks to vector database")
                return True
            else:
                logger.error("Failed to store documents in vector database")
                return False

        except Exception as e:
            logger.error(f"Error indexing documents: {str(e)}")
            return False

    async def query(self,
                   query_text: str,
                   context_mode: str = "full_book",
                   selected_text: Optional[str] = None,
                   top_k: int = 5) -> Dict[str, Any]:
        """Query the RAG system for a response"""
        if not self.initialized:
            raise RuntimeError("RAG service not initialized")

        try:
            # If selected text mode is used, search within the selected text
            if context_mode == "selected_text" and selected_text:
                # In selected text mode, we use the selected text as context
                response = await self._generate_response_with_selected_text(
                    query_text, selected_text
                )

                return {
                    "response": response,
                    "sources": ["selected_text_context"],
                    "confidence": 0.9,
                    "context_used": "selected_text"
                }

            # Otherwise, search in the vector database
            else:
                # Search for relevant documents
                search_results = await self.vector_db.search(query_text, top_k=top_k)

                if not search_results:
                    # No relevant documents found, generate general response
                    response = await self._generate_general_response(query_text)

                    return {
                        "response": response,
                        "sources": [],
                        "confidence": 0.5,
                        "context_used": "general_knowledge"
                    }

                # Combine retrieved contexts
                context_texts = [result["content"] for result in search_results]
                combined_context = "\n\n".join(context_texts)

                # Generate response using retrieved context
                response = await self._generate_response_with_context(
                    query_text, combined_context
                )

                # Extract sources and calculate confidence
                sources = [result["metadata"].get("file_path", "unknown") for result in search_results]
                confidence = min(0.95, max(0.6, len(search_results) * 0.2))  # Basic confidence calculation

                return {
                    "response": response,
                    "sources": sources,
                    "confidence": confidence,
                    "context_used": "full_book"
                }

        except Exception as e:
            logger.error(f"Error in query: {str(e)}")
            return {
                "response": "I encountered an error processing your request. Please try again.",
                "sources": [],
                "confidence": 0.0,
                "context_used": "error"
            }

    async def _generate_response_with_selected_text(self, query: str, selected_text: str) -> str:
        """Generate response using selected text as context"""
        # In a real implementation, this would use a language model
        # For now, we'll return a simulated response

        # Find relevant parts in the selected text based on query keywords
        query_lower = query.lower()
        selected_lower = selected_text.lower()

        # Find sentences that contain query keywords
        sentences = selected_text.split('.')
        relevant_sentences = []

        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in query_lower.split()):
                relevant_sentences.append(sentence.strip())

        if relevant_sentences:
            context_preview = ". ".join(relevant_sentences[:2])  # Take first 2 relevant sentences
            response = f"Based on the selected text: '{context_preview}...', I can provide more detailed information. In a real implementation, this would use the selected text as context to generate a precise answer related to: {query}"
        else:
            response = f"The selected text doesn't seem to contain information directly related to '{query}'. In a real implementation, this would analyze the selected text for relevant information."

        return response

    async def _generate_response_with_context(self, query: str, context: str) -> str:
        """Generate response using retrieved context"""
        # In a real implementation, this would use a language model to generate
        # a response based on the query and context
        # For now, we'll return a simulated response

        # Extract key information from context related to the query
        query_keywords = query.lower().split()
        context_lower = context.lower()

        # Find sentences in context that contain query keywords
        sentences = context.split('.')
        relevant_sentences = []

        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in query_keywords):
                relevant_sentences.append(sentence.strip())

        if relevant_sentences:
            # Take first few relevant sentences as preview
            context_preview = ". ".join(relevant_sentences[:3])
            response = f"Based on the textbook content: '{context_preview}...', I can provide detailed information about '{query}'. In a real implementation, this would be a comprehensive answer generated using the context from the Physical AI & Humanoid Robotics textbook."
        else:
            response = f"Regarding '{query}', the Physical AI & Humanoid Robotics textbook covers advanced topics in robotics, AI, and embodied intelligence. In a real implementation, this would provide a detailed answer using the retrieved context."

        return response

    async def _generate_general_response(self, query: str) -> str:
        """Generate a general response when no specific context is found"""
        response = f"I understand you're asking about '{query}' in the context of Physical AI & Humanoid Robotics. While I don't have specific information in my current knowledge base, the Physical AI & Humanoid Robotics textbook covers advanced topics in robotics including: perception systems, control algorithms, human-robot interaction, simulation environments, and embodied intelligence. In a real implementation with a fully indexed textbook, I would provide specific information from the relevant chapters."

        return response

    async def get_document_count(self) -> int:
        """Get the total number of indexed documents"""
        if not self.initialized:
            return 0

        return await self.vector_db.get_document_count()

    async def update_document(self, chunk_id: str, content: str, metadata: Dict[str, Any]) -> bool:
        """Update a specific document chunk"""
        if not self.initialized:
            return False

        return await self.vector_db.update_document(chunk_id, content, metadata)

    async def health_check(self) -> Dict[str, Any]:
        """Perform health check of the RAG service"""
        try:
            doc_count = await self.get_document_count()
            return {
                "status": "healthy",
                "initialized": self.initialized,
                "document_count": doc_count,
                "vector_db_connected": True
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "initialized": self.initialized
            }

    async def close(self):
        """Close the RAG service"""
        await self.vector_db.close()