# Data Model: Physical AI & Humanoid Robotics Textbook

## Entities and Relationships

### User
- **Fields**:
  - id (string, UUID)
  - email (string, unique, required)
  - name (string, required)
  - background_profile (json, optional)
  - created_at (timestamp, required)
  - updated_at (timestamp, required)
  - preferences (json, optional)
- **Relationships**:
  - One-to-many with UserProgress
  - One-to-many with UserInteractions
- **Validation rules**:
  - Email must be valid format
  - Name must be 1-100 characters
  - Background profile must follow predefined schema

### TextbookModule
- **Fields**:
  - id (string, required)
  - title (string, required)
  - description (string, required)
  - version (string, required)
  - order (integer, required)
  - created_at (timestamp, required)
  - updated_at (timestamp, required)
- **Relationships**:
  - One-to-many with Lesson
  - Many-to-many with UserProgress (through progress tracking)
- **Validation rules**:
  - Title must be 1-200 characters
  - Version must follow semantic versioning

### Lesson
- **Fields**:
  - id (string, required)
  - module_id (string, required)
  - title (string, required)
  - content (string, required)
  - lesson_template_components (json, required)
  - order (integer, required)
  - estimated_duration_minutes (integer, required)
  - created_at (timestamp, required)
  - updated_at (timestamp, required)
- **Relationships**:
  - Many-to-one with TextbookModule
  - One-to-many with UserProgress
  - One-to-many with LessonInteraction
- **Validation rules**:
  - Must contain all 8 required template components (objectives, concepts, architecture, etc.)
  - Content must be in valid Markdown/MDX format
  - Estimated duration must be positive

### UserProgress
- **Fields**:
  - id (string, required)
  - user_id (string, required)
  - lesson_id (string, required)
  - status (enum: not_started, in_progress, completed)
  - completion_percentage (integer, 0-100)
  - last_accessed_at (timestamp, required)
  - completed_at (timestamp, optional)
  - created_at (timestamp, required)
  - updated_at (timestamp, required)
- **Relationships**:
  - Many-to-one with User
  - Many-to-one with Lesson
- **Validation rules**:
  - Status must be one of the defined enum values
  - Completion percentage must be between 0-100

### LessonInteraction
- **Fields**:
  - id (string, required)
  - user_id (string, required)
  - lesson_id (string, required)
  - interaction_type (enum: view, lab_start, lab_complete, bookmark, note)
  - interaction_data (json, optional)
  - timestamp (timestamp, required)
- **Relationships**:
  - Many-to-one with User
  - Many-to-one with Lesson
- **Validation rules**:
  - Interaction type must be one of defined enum values

### RAGQuery
- **Fields**:
  - id (string, required)
  - user_id (string, optional)
  - query_text (string, required)
  - response_text (string, required)
  - source_documents (json, required)
  - query_type (enum: full_book_qa, selected_text_qa)
  - timestamp (timestamp, required)
  - response_time_ms (integer, required)
- **Relationships**:
  - Many-to-one with User (optional for anonymous queries)
- **Validation rules**:
  - Query and response text must not be empty
  - Source documents must be valid document references

### HardwareConfiguration
- **Fields**:
  - id (string, required)
  - name (string, required)
  - type (enum: digital_twin_workstation, edge_ai_kit_jetson, robot_lab_proxy, robot_lab_miniature, robot_lab_premium)
  - specifications (json, required)
  - setup_instructions (string, required)
  - tradeoffs (json, required)
  - created_at (timestamp, required)
  - updated_at (timestamp, required)
- **Relationships**:
  - One-to-many with UserInteraction (when users access hardware docs)
- **Validation rules**:
  - Type must be one of the defined hardware types
  - Specifications must follow predefined schema

### PersonalizationSetting
- **Fields**:
  - id (string, required)
  - user_id (string, required)
  - setting_key (string, required)
  - setting_value (json, required)
  - created_at (timestamp, required)
  - updated_at (timestamp, required)
- **Relationships**:
  - Many-to-one with User
- **Validation rules**:
  - Setting key must be from predefined list
  - Setting value must match expected format for the key

## State Transitions

### UserProgress State Transitions
- not_started → in_progress (when user starts lesson)
- in_progress → completed (when user completes lesson)
- completed → in_progress (if user revisits lesson)

## Database Schema Notes

- All timestamps use ISO 8601 format
- JSON fields follow predefined schemas for validation
- Foreign key relationships enforce referential integrity
- Indexes on frequently queried fields (user_id, lesson_id, module_id)
- Soft deletes for important entities (add deleted_at field)