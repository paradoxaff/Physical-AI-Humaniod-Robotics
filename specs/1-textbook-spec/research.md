# Research: Physical AI & Humanoid Robotics Textbook

## Phase 0: Research and Unknown Resolution

### Decision: Docusaurus Implementation
**Rationale**: Docusaurus is the optimal choice for the textbook platform as it's specifically designed for documentation sites, supports versioning natively, has excellent Markdown/MDX support, and provides built-in search and navigation features. It aligns with the constitutional requirement to use Markdown/MDX only.

**Alternatives considered**:
- GitBook: Good but less flexible than Docusaurus
- Sphinx: More Python-focused, less suitable for multi-language content
- Custom React site: More complex to maintain and lacks built-in documentation features

### Decision: Backend Technology Stack
**Rationale**: FastAPI was selected for the backend due to its high performance, excellent TypeScript/JavaScript integration capabilities, built-in API documentation, and async support which is important for RAG operations. It pairs well with the modern AI tools mentioned in the requirements.

**Alternatives considered**:
- Express.js: More common but slower than FastAPI
- Flask: Python-based but slower than FastAPI
- Next.js API routes: Good but FastAPI has better async support for RAG

### Decision: Database Technology
**Rationale**: Neon Serverless Postgres was selected as it provides serverless scalability, automatic pause when not in use (cost-effective), and full PostgreSQL compatibility for complex queries. It's ideal for user data, profiles, and authentication storage.

**Alternatives considered**:
- Supabase: Similar but Neon offers better serverless features
- PlanetScale: MySQL-based, less familiar for complex queries
- MongoDB: Document-based but PostgreSQL offers better relational capabilities

### Decision: Vector Database for RAG
**Rationale**: Qdrant Cloud was selected for vector storage due to its excellent performance for semantic search, cloud hosting options, and good integration with Python AI libraries. It's specifically designed for RAG applications.

**Alternatives considered**:
- Pinecone: Good but more expensive
- Weaviate: Good alternative but Qdrant has better free tier options
- ChromaDB: Open source but requires self-hosting

### Decision: Authentication System
**Rationale**: Better Auth was selected for its modern approach to authentication, good integration with various frontend frameworks, and built-in security features. It's designed for modern web applications and integrates well with Docusaurus sites.

**Alternatives considered**:
- NextAuth.js: Good but more Next.js specific
- Auth0: More complex and expensive
- Clerk: Good alternative but Better Auth is more lightweight

### Decision: AI Integration Framework
**Rationale**: OpenAI Agents with ChatKit was selected for the RAG functionality as it provides the most robust tools for creating conversational AI experiences, with good support for document retrieval and conversation management.

**Alternatives considered**:
- LangChain: Good but OpenAI's native tools have better integration
- LlamaIndex: Good alternative but OpenAI tools are more integrated
- Custom solution: More complex and less reliable

### Decision: Content Structure
**Rationale**: The module-based structure under docs/modules/module-x/ follows Docusaurus best practices and allows for clear organization of content. Each module can represent a major topic area in Physical AI and Humanoid Robotics.

**Implementation approach**:
- Each module will contain multiple lessons
- Hardware section will be in separate top-level directory
- Versioning will be implemented using Docusaurus versioning plugin

### Decision: Lab-First Content Strategy
**Rationale**: The lab-first approach means each lesson will start with practical examples and simulations before diving into theory. This aligns with the "engineering-first" constitutional requirement and helps students connect software intelligence to physical embodiment.

**Implementation**:
- Each lesson will begin with a practical lab or simulation
- Theory will follow to explain the concepts demonstrated
- Code examples will be tested and verified