# System Architecture Diagrams

Visual representations of the chat application architecture, data flow, and component relationships.

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph Client["Frontend - React + TypeScript"]
        UI[User Interface]
        Components[React Components]
        Hooks[Custom Hooks]
        API[API Client Layer]
    end

    subgraph Server["Backend - Node.js + Express"]
        Routes[API Routes]
        Services[Business Services]
        AI[AI Service Layer]
        Middleware[Middleware]
    end

    subgraph Storage["Data Storage"]
        MongoDB[(MongoDB Database)]
        FileSystem[File System - uploads/]
    end

    subgraph External["External Services"]
        OpenAI[OpenAI API]
    end

    UI --> Components
    Components --> Hooks
    Hooks --> API
    API -->|HTTP/REST| Routes
    Routes --> Middleware
    Middleware --> Services
    Services --> AI
    Services --> MongoDB
    Services --> FileSystem
    AI -.->|Optional| OpenAI

    style Client fill:#e3f2fd
    style Server fill:#fff3e0
    style Storage fill:#f3e5f5
    style External fill:#e8f5e9
```

---

## 2. Application Layer Architecture

```mermaid
graph LR
    subgraph Frontend["Frontend Layers"]
        direction TB
        PL[Presentation Layer<br/>Components]
        HL[Hook Layer<br/>Business Logic]
        AL[API Layer<br/>HTTP Client]
    end

    subgraph Backend["Backend Layers"]
        direction TB
        RL[Route Layer<br/>Endpoints]
        SL[Service Layer<br/>Business Logic]
        DL[Data Layer<br/>Models]
    end

    subgraph Data["Data Storage"]
        direction TB
        DB[(MongoDB)]
        FS[File System]
    end

    PL --> HL
    HL --> AL
    AL -->|REST API| RL
    RL --> SL
    SL --> DL
    DL --> DB
    SL --> FS

    style Frontend fill:#bbdefb
    style Backend fill:#ffe0b2
    style Data fill:#f8bbd0
```

---

## 3. Component Hierarchy

```mermaid
graph TD
    App[App.tsx]
    App --> ChatLayout[ChatLayout]

    ChatLayout --> Sidebar[Sidebar]
    ChatLayout --> Topbar[Topbar]
    ChatLayout --> ChatArea[Chat Area]

    Sidebar --> MenuItems[Menu Items]

    Topbar --> Logo[Logo]
    Topbar --> Search[Search Bar]
    Topbar --> Buttons[Action Buttons]

    ChatArea --> MessageList[MessageList]
    ChatArea --> ChatInput[ChatInput]

    MessageList --> MessageItem1[MessageItem]
    MessageList --> MessageItem2[MessageItem]
    MessageList --> MessageItemN[MessageItem...]

    MessageItem1 --> Content[Message Content]
    MessageItem1 --> Attachments[Image Thumbnails]

    ChatInput --> Textarea[Multiline Input]
    ChatInput --> FilePreview[FilePreview]
    ChatInput --> UploadBtn[Plus Button]
    ChatInput --> SendBtn[Send Button]

    style App fill:#1976d2,color:#fff
    style ChatLayout fill:#42a5f5,color:#fff
    style ChatArea fill:#64b5f6
    style MessageList fill:#90caf9
    style ChatInput fill:#90caf9
```

---

## 4. Data Flow - Send Message

```mermaid
sequenceDiagram
    participant User
    participant UI as Chat UI
    participant Hook as useChat Hook
    participant API as API Client
    participant Route as Express Route
    participant Service as Message Service
    participant AI as AI Service
    participant DB as MongoDB

    User->>UI: Types message & clicks Send
    UI->>Hook: sendMessage(content, attachments)
    Hook->>API: POST /messages
    API->>Route: HTTP Request

    Route->>Service: createUserMessage()
    Service->>DB: Save user message
    DB-->>Service: User message saved

    Route->>AI: generateResponse()
    AI-->>Route: AI response text

    Route->>Service: createAssistantMessage()
    Service->>DB: Save assistant message
    DB-->>Service: Assistant message saved

    Route-->>API: Both messages
    API-->>Hook: Update state
    Hook-->>UI: Re-render with new messages
    UI-->>User: Display messages
```

---

## 5. Data Flow - File Upload

```mermaid
sequenceDiagram
    participant User
    participant UI as Chat Input
    participant Hook as useFileUpload
    participant API as Upload API
    participant Multer as Multer Middleware
    participant FS as File System

    User->>UI: Clicks plus button
    UI->>User: Opens file picker
    User->>UI: Selects image file

    UI->>Hook: handleFileSelect(file)
    Hook->>Hook: Validate file type & size
    Hook->>UI: Show preview

    User->>UI: Clicks Send
    UI->>Hook: uploadFile()
    Hook->>API: POST /uploads (FormData)

    API->>Multer: Process multipart/form-data
    Multer->>Multer: Validate file
    Multer->>FS: Save file to uploads/
    FS-->>Multer: File saved

    Multer-->>API: File metadata
    API-->>Hook: File ID & URL
    Hook->>UI: Include in message
    UI->>API: POST /messages with file ID
```

---

## 6. Database Schema Relationships

```mermaid
erDiagram
    CONVERSATION ||--o{ MESSAGE : contains
    MESSAGE ||--o{ ATTACHMENT : has

    CONVERSATION {
        ObjectId _id PK
        string title
        Date createdAt
        Date updatedAt
    }

    MESSAGE {
        ObjectId _id PK
        ObjectId conversationId FK
        string role
        string content
        Array attachments
        Date createdAt
    }

    ATTACHMENT {
        string fileName
        string originalName
        string mimeType
        number size
        string url
    }
```

---

## 7. API Endpoint Structure

```mermaid
graph TD
    API["/api"]

    API --> Conv["/conversations"]
    API --> Upload["/uploads"]

    Conv --> GetConv["GET /<br/>Get all conversations"]
    Conv --> ConvId["/:conversationId"]

    ConvId --> Messages["/messages"]
    Messages --> GetMsg["GET /<br/>Get messages"]
    Messages --> PostMsg["POST /<br/>Send message"]

    Upload --> PostUpload["POST /<br/>Upload file"]

    style API fill:#1976d2,color:#fff
    style Conv fill:#42a5f5,color:#fff
    style Upload fill:#42a5f5,color:#fff
    style Messages fill:#64b5f6
```

---

## 8. AI Service Architecture

```mermaid
graph TB
    Factory[AI Service Factory]
    Interface[AIService Interface]

    Factory -->|Check API Key| Decision{OPENAI_API_KEY<br/>exists?}

    Decision -->|Yes| OpenAI[OpenAI Service]
    Decision -->|No| Mock[Mock Service]

    Interface -.->|implements| OpenAI
    Interface -.->|implements| Mock

    OpenAI -->|API Call| OpenAIAPI[OpenAI API]
    Mock -->|Local Logic| Responses[Predefined Responses]

    MessageService[Message Service] --> Factory

    style Factory fill:#ffd54f
    style Interface fill:#fff59d
    style OpenAI fill:#aed581
    style Mock fill:#aed581
```

---

## 9. Frontend State Management

```mermaid
graph TD
    subgraph "useChat Hook"
        ChatState[Chat State]
        ChatState --> Messages[messages: Message array]
        ChatState --> Loading[isLoading: boolean]
        ChatState --> Error[error: string or null]
        ChatState --> ConvId[conversationId: string]
    end

    subgraph "useFileUpload Hook"
        FileState[File Upload State]
        FileState --> SelectedFile[selectedFile: File or null]
        FileState --> Preview[previewUrl: string or null]
        FileState --> FileId[uploadedFileId: string or null]
        FileState --> Uploading[isUploading: boolean]
    end

    subgraph "useAutoScroll Hook"
        ScrollState[Auto Scroll State]
        ScrollState --> Ref[messagesEndRef: RefObject]
    end

    Components[React Components] --> ChatState
    Components --> FileState
    Components --> ScrollState

    style ChatState fill:#e1bee7
    style FileState fill:#c5cae9
    style ScrollState fill:#b2dfdb
```

---

## 10. Request/Response Flow

```mermaid
graph LR
    subgraph Request["Request Processing"]
        direction TB
        R1[1. CORS Check]
        R2[2. Body Parsing]
        R3[3. Route Matching]
        R4[4. Validation]
        R5[5. Business Logic]
        R6[6. Database Query]

        R1 --> R2 --> R3 --> R4 --> R5 --> R6
    end

    subgraph Response["Response Generation"]
        direction TB
        S1[1. Format Data]
        S2[2. Add Metadata]
        S3[3. Error Handling]
        S4[4. Send JSON]

        S1 --> S2 --> S3 --> S4
    end

    R6 --> S1

    style Request fill:#ffccbc
    style Response fill:#c8e6c9
```

---

## 11. File Upload Flow Diagram

```mermaid
flowchart TD
    Start([User Clicks Plus Button])
    Start --> Select[Select Image File]
    Select --> Validate{Valid Image?<br/>PNG/JPG/GIF<br/>< 5MB}

    Validate -->|No| Error[Show Error Message]
    Error --> End1([End])

    Validate -->|Yes| Preview[Show Preview with Thumbnail]
    Preview --> UserAction{User Action}

    UserAction -->|Remove| Clear[Clear Preview]
    Clear --> End2([End])

    UserAction -->|Send| Upload[Upload to Server]
    Upload --> Server{Server Validation}

    Server -->|Fail| ServerError[Show Upload Error]
    ServerError --> End3([End])

    Server -->|Success| SaveMetadata[Save File Metadata]
    SaveMetadata --> SendMessage[Send Message with File ID]
    SendMessage --> Display[Display in Chat]
    Display --> End4([End])

    style Start fill:#4caf50,color:#fff
    style Error fill:#f44336,color:#fff
    style ServerError fill:#f44336,color:#fff
    style Display fill:#2196f3,color:#fff
```

---

## 12. Message Creation Flow

```mermaid
flowchart TD
    Start([POST /messages Request])
    Start --> Extract[Extract content & attachments]
    Extract --> CreateUser[Create User Message]
    CreateUser --> SaveUser[Save to MongoDB]

    SaveUser --> PrepareContext[Prepare Conversation Context]
    PrepareContext --> CallAI[Call AI Service]

    CallAI --> CheckService{Which Service?}
    CheckService -->|Mock| MockResponse[Generate Mock Response]
    CheckService -->|OpenAI| APICall[Call OpenAI API]

    MockResponse --> CreateAssistant[Create Assistant Message]
    APICall --> CreateAssistant

    CreateAssistant --> SaveAssistant[Save to MongoDB]
    SaveAssistant --> Return[Return Both Messages]
    Return --> End([Response Sent])

    style Start fill:#4caf50,color:#fff
    style CallAI fill:#ff9800,color:#fff
    style End fill:#2196f3,color:#fff
```

---

## 13. Component Communication Pattern

```mermaid
graph TB
    subgraph "Parent Component"
        App[App Component]
    end

    subgraph "Custom Hooks"
        useChat[useChat Hook]
        useFileUpload[useFileUpload Hook]
    end

    subgraph "Child Components"
        MessageList[MessageList]
        ChatInput[ChatInput]
    end

    subgraph "API Layer"
        MessagesAPI[Messages API]
        UploadsAPI[Uploads API]
    end

    App --> useChat
    App --> useFileUpload

    useChat --> MessagesAPI
    useFileUpload --> UploadsAPI

    useChat -.->|messages, isLoading| MessageList
    useChat -.->|sendMessage| ChatInput
    useFileUpload -.->|file state & handlers| ChatInput

    ChatInput -->|user action| useChat
    ChatInput -->|file selection| useFileUpload

    style App fill:#1976d2,color:#fff
    style useChat fill:#42a5f5,color:#fff
    style useFileUpload fill:#42a5f5,color:#fff
```

---

## 14. Error Handling Flow

```mermaid
flowchart TD
    Request[API Request]
    Request --> Try{Try Block}

    Try -->|Success| Process[Process Request]
    Process --> Response[Send Success Response]
    Response --> End1([End])

    Try -->|Error| Catch[Catch Block]
    Catch --> ErrorType{Error Type}

    ErrorType -->|Validation| E400[400 Bad Request]
    ErrorType -->|Not Found| E404[404 Not Found]
    ErrorType -->|Server| E500[500 Server Error]

    E400 --> ErrorHandler[Global Error Handler]
    E404 --> ErrorHandler
    E500 --> ErrorHandler

    ErrorHandler --> Log[Log Error]
    Log --> Format[Format Error Response]
    Format --> SendError[Send Error Response]
    SendError --> End2([End])

    style Request fill:#4caf50,color:#fff
    style E400 fill:#ff9800,color:#fff
    style E404 fill:#ff9800,color:#fff
    style E500 fill:#f44336,color:#fff
```

---

## 15. Deployment Architecture

```mermaid
graph TB
    subgraph "Client Side"
        Browser[Web Browser]
    end

    subgraph "Frontend Hosting"
        CDN[CDN / Static Hosting<br/>Vercel, Netlify]
        Static[Static Files<br/>HTML, CSS, JS]
    end

    subgraph "Backend Hosting"
        Server[Node.js Server<br/>Railway, Render]
        API[Express API]
    end

    subgraph "Database"
        MongoDB[(MongoDB Atlas)]
    end

    subgraph "File Storage"
        Files[Uploaded Files<br/>Server Filesystem]
    end

    subgraph "External APIs"
        OpenAI[OpenAI API]
    end

    Browser --> CDN
    CDN --> Static
    Browser -->|API Calls| API
    API --> Server
    Server --> MongoDB
    Server --> Files
    Server -.->|Optional| OpenAI

    style Browser fill:#e3f2fd
    style CDN fill:#fff3e0
    style Server fill:#ffe0b2
    style MongoDB fill:#f3e5f5
    style OpenAI fill:#e8f5e9
```

---

## Diagram Explanations

### High-Level System Architecture

Shows the three main layers: Frontend (React), Backend (Express), and Storage (MongoDB + File System), plus optional external AI service integration.

### Application Layer Architecture

Illustrates the separation of concerns with distinct layers for presentation, business logic, API communication, and data access.

### Component Hierarchy

Visual representation of how React components are nested and organized, from the root App component down to individual UI elements.

### Data Flow - Send Message

Sequence diagram showing the complete flow when a user sends a message, including AI response generation and database persistence.

### Data Flow - File Upload

Detailed sequence of events when a user uploads an image file, from selection through validation to storage.

### Database Schema Relationships

Entity-relationship diagram showing how Conversations, Messages, and Attachments are related in MongoDB.

### API Endpoint Structure

Tree structure of all REST API endpoints and their HTTP methods.

### AI Service Architecture

Shows the factory pattern used for AI service selection and the two implementations (Mock and OpenAI).

### Frontend State Management

Breakdown of state managed by custom React hooks and how components consume this state.

### Request/Response Flow

Step-by-step processing of HTTP requests and response generation in the Express backend.

### File Upload Flow Diagram

Decision tree showing all possible paths during file upload, including validation and error handling.

### Message Creation Flow

Detailed flowchart of the message creation process, including AI response generation.

### Component Communication Pattern

Shows how data flows between parent components, custom hooks, child components, and the API layer.

### Error Handling Flow

Illustrates how different types of errors are caught, categorized, and handled throughout the application.

### Deployment Architecture

Production deployment setup showing how different parts of the application are hosted and connected.

---

These diagrams provide a comprehensive visual guide to understanding the chat application's architecture, data flow, and component relationships. Use them as reference during implementation and for onboarding new developers.
