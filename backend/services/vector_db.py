import asyncio
import logging
from typing import List, Dict, Any, Optional
from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models as qdrant_models
from sentence_transformers import SentenceTransformer
import numpy as np
import os

logger = logging.getLogger(__name__)

class DocumentChunk:
    """Represents a chunk of a document with metadata"""
    def __init__(self, id: str, content: str, metadata: Dict[str, Any], embedding: Optional[List[float]] = None):
        self.id = id
        self.content = content
        self.metadata = metadata
        self.embedding = embedding

class VectorDBService:
    """Service for managing vector database operations with Qdrant"""

    def __init__(self, host: str = "localhost", port: int = 6333, collection_name: str = "physical_ai_docs", use_memory_storage: bool = True):
        self.host = host
        self.port = port
        self.collection_name = collection_name
        self.use_memory_storage = use_memory_storage
        self.client = None
        self.encoder = None

    async def initialize(self):
        """Initialize the vector database connection and encoder"""
        try:
            # Initialize Qdrant client
            if self.use_memory_storage:
                # Use in-memory storage for local development
                from qdrant_client.local.async_qdrant_local import AsyncQdrantLocal
                self.client = AsyncQdrantLocal(location=":memory:")
            else:
                # Use remote Qdrant server
                self.client = AsyncQdrantClient(host=self.host, port=self.port)

            # Initialize sentence transformer model for embeddings
            self.encoder = SentenceTransformer('all-MiniLM-L6-v2')  # Lightweight model for embeddings

            # Create collection if it doesn't exist
            collections = await self.client.get_collections()
            collection_exists = any(col.name == self.collection_name for col in collections.collections)

            if not collection_exists:
                await self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=qdrant_models.VectorParams(
                        size=384,  # Size of all-MiniLM-L6-v2 embeddings
                        distance=qdrant_models.Distance.COSINE
                    )
                )

                logger.info(f"Created Qdrant collection: {self.collection_name}")
            else:
                logger.info(f"Connected to existing Qdrant collection: {self.collection_name}")

        except Exception as e:
            logger.error(f"Error initializing vector database: {str(e)}")
            raise

    async def store_documents(self, chunks: List[DocumentChunk]) -> bool:
        """Store document chunks in the vector database"""
        try:
            # Prepare points for insertion
            points = []
            for chunk in chunks:
                # Generate embedding if not already present
                if chunk.embedding is None:
                    chunk.embedding = self.encoder.encode(chunk.content).tolist()

                # Create Qdrant point
                point = qdrant_models.PointStruct(
                    id=chunk.id,
                    vector=chunk.embedding,
                    payload={
                        "content": chunk.content,
                        "metadata": chunk.metadata
                    }
                )
                points.append(point)

            # Upload points to Qdrant
            await self.client.upload_points(
                collection_name=self.collection_name,
                points=points
            )

            logger.info(f"Stored {len(points)} document chunks in vector database")
            return True

        except Exception as e:
            logger.error(f"Error storing documents: {str(e)}")
            return False

    async def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search for relevant documents based on query"""
        try:
            # Generate embedding for query
            query_embedding = self.encoder.encode(query).tolist()

            # Search in Qdrant
            search_results = await self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=top_k
            )

            # Format results
            results = []
            for hit in search_results:
                results.append({
                    "id": hit.id,
                    "content": hit.payload["content"],
                    "metadata": hit.payload["metadata"],
                    "score": hit.score
                })

            logger.debug(f"Search returned {len(results)} results")
            return results

        except Exception as e:
            logger.error(f"Error searching documents: {str(e)}")
            return []

    async def delete_collection(self) -> bool:
        """Delete the entire collection (use with caution!)"""
        try:
            await self.client.delete_collection(self.collection_name)
            logger.info(f"Deleted collection: {self.collection_name}")
            return True
        except Exception as e:
            logger.error(f"Error deleting collection: {str(e)}")
            return False

    async def get_document_count(self) -> int:
        """Get the total number of documents in the collection"""
        try:
            collection_info = await self.client.get_collection(self.collection_name)
            return collection_info.points_count
        except Exception as e:
            logger.error(f"Error getting document count: {str(e)}")
            return 0

    async def update_document(self, chunk_id: str, content: str, metadata: Dict[str, Any]) -> bool:
        """Update a specific document chunk"""
        try:
            # Generate new embedding
            new_embedding = self.encoder.encode(content).tolist()

            # Update the point in Qdrant
            await self.client.upsert(
                collection_name=self.collection_name,
                points=[
                    qdrant_models.PointStruct(
                        id=chunk_id,
                        vector=new_embedding,
                        payload={
                            "content": content,
                            "metadata": metadata
                        }
                    )
                ]
            )

            logger.debug(f"Updated document chunk: {chunk_id}")
            return True

        except Exception as e:
            logger.error(f"Error updating document {chunk_id}: {str(e)}")
            return False

    async def close(self):
        """Close the database connection"""
        if self.client:
            # Qdrant client doesn't need explicit closing
            pass