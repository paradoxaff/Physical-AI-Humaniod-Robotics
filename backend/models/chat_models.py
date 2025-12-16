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
    context_used: Optional[str] = None


class DocumentChunk(BaseModel):
    id: str
    content: str
    page_title: str
    page_url: str
    metadata: dict


class IndexStatus(BaseModel):
    indexed_count: int
    total_count: int
    status: str