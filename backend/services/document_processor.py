import asyncio
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import hashlib
import aiofiles
import markdown
from bs4 import BeautifulSoup
import tiktoken

logger = logging.getLogger(__name__)

@dataclass
class DocumentChunk:
    """Represents a chunk of a document with metadata"""
    id: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[List[float]] = None

class DocumentProcessor:
    """Service for processing and chunking documents for RAG"""

    def __init__(self, chunk_size: int = 1000, overlap: int = 200):
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.enc = tiktoken.encoding_for_model("gpt-3.5-turbo")

    async def process_document_directory(self, directory_path: str) -> List[DocumentChunk]:
        """Process all markdown files in a directory"""
        directory = Path(directory_path)
        all_chunks = []

        # Find all markdown files
        md_files = list(directory.rglob("*.md")) + list(directory.rglob("*.mdx"))

        for file_path in md_files:
            try:
                chunks = await self.process_single_document(file_path)
                all_chunks.extend(chunks)
                logger.info(f"Processed {len(chunks)} chunks from {file_path}")
            except Exception as e:
                logger.error(f"Error processing {file_path}: {str(e)}")

        return all_chunks

    async def process_single_document(self, file_path: Path) -> List[DocumentChunk]:
        """Process a single markdown document into chunks"""
        # Read the file
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()

        # Convert markdown to plain text for processing
        soup = BeautifulSoup(markdown.markdown(content), 'html.parser')
        plain_text = soup.get_text()

        # Create metadata
        relative_path = file_path.relative_to(Path('.'))
        metadata = {
            'file_path': str(relative_path),
            'file_name': file_path.name,
            'module': self._extract_module_from_path(str(relative_path)),
            'section': self._extract_section_from_path(str(relative_path)),
            'word_count': len(plain_text.split()),
            'char_count': len(plain_text)
        }

        # Split into chunks
        chunks = self._chunk_text(plain_text)

        # Create document chunks with IDs
        document_chunks = []
        for i, chunk_text in enumerate(chunks):
            chunk_id = self._generate_chunk_id(file_path, i)
            chunk = DocumentChunk(
                id=chunk_id,
                content=chunk_text,
                metadata=metadata.copy()
            )
            document_chunks.append(chunk)

        return document_chunks

    def _chunk_text(self, text: str) -> List[str]:
        """Split text into overlapping chunks"""
        # Split by sentences to maintain coherence
        sentences = self._split_into_sentences(text)

        chunks = []
        current_chunk = ""
        current_length = 0

        for sentence in sentences:
            sentence_tokens = len(self.enc.encode(sentence))

            # If adding this sentence would exceed chunk size
            if current_length + sentence_tokens > self.chunk_size and current_chunk:
                # Save current chunk
                chunks.append(current_chunk.strip())

                # Start new chunk with overlap
                if self.overlap > 0:
                    # Get the last part of current chunk for overlap
                    overlap_tokens = self.enc.encode(current_chunk)
                    if len(overlap_tokens) > self.overlap:
                        # Get the last 'overlap' tokens and decode them
                        overlap_start = max(0, len(overlap_tokens) - self.overlap)
                        overlap_part = self.enc.decode(overlap_tokens[overlap_start:])
                        current_chunk = overlap_part + " " + sentence
                        current_length = len(self.enc.encode(current_chunk))
                    else:
                        current_chunk = sentence
                        current_length = sentence_tokens
                else:
                    current_chunk = sentence
                    current_length = sentence_tokens
            else:
                # Add sentence to current chunk
                if current_chunk:
                    current_chunk += " " + sentence
                else:
                    current_chunk = sentence
                current_length += sentence_tokens

        # Add the last chunk if it has content
        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return chunks

    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        import re
        # Split on sentence endings followed by whitespace and capital letter
        sentences = re.split(r'[.!?]+\s+', text)
        # Clean up and remove empty strings
        return [s.strip() for s in sentences if s.strip()]

    def _extract_module_from_path(self, file_path: str) -> str:
        """Extract module name from file path"""
        # Look for module pattern in path (e.g., module-01-ros2)
        import re
        match = re.search(r'module-\d+', file_path)
        return match.group(0) if match else "unknown"

    def _extract_section_from_path(self, file_path: str) -> str:
        """Extract section name from file path"""
        path_parts = file_path.split('/')
        if len(path_parts) > 1:
            return path_parts[-2]  # Second to last part is usually the section
        return "general"

    def _generate_chunk_id(self, file_path: Path, chunk_index: int) -> str:
        """Generate a unique ID for a chunk as a proper UUID"""
        import uuid
        # Create a deterministic UUID based on file path and chunk index
        unique_string = f"{file_path}_{chunk_index:04d}"
        return str(uuid.uuid5(uuid.NAMESPACE_DNS, unique_string))