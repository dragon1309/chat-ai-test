# Fullstack Chat Application - Architecture Plan

## Project Overview

A fullstack chat application similar to template.net AI chat, built with React, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, and REST API.

## Key Requirements Summary

- Single anonymous user, one default conversation
- No authentication or streaming responses
- Multiline chat input with send button
- Image upload (png, jpg, gif) with preview thumbnails
- Conversation history persisted in MongoDB
- AI service abstraction (mock by default, OpenAI-ready)
- Template.net-style UI with sidebar, topbar, and chat area

---

## 1. Project Folder Structure

```
chat-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # MongoDB connection
│   │   │   └── environment.ts       # Environment variables
│   │   ├── models/
│   │   │   ├── Conversation.ts      # Conversation schema
│   │   │   └── Message.ts           # Message schema
│   │   ├── routes/
│   │   │   ├── conversations.ts     # Conversation routes
│   │   │   ├── messages.ts          # Message routes
│   │   │   └── uploads.ts           # File upload routes
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── AIService.ts     # AI service interface
│   │   │   │   ├── MockAIService.ts # Mock implementation
│   │   │   │   └── OpenAIService.ts # OpenAI implementation
│   │   │   ├── conversationService.ts
│   │   │   ├── messageService.ts
│   │   │   └── uploadService.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts      # Global error handler
│   │   │   └── uploadMiddleware.ts  # Multer configuration
│   │   ├── types/
│   │   │   └── index.ts             # Shared TypeScript types
│   │   ├── utils/
│   │   │   └── logger.ts            # Logging utility
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts                # Server entry point
│   ├── uploads/                     # Uploaded files storage
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts            # Axios instance
│   │   │   ├── conversations.ts     # Conversation API calls
│   │   │   ├── messages.ts          # Message API calls
│   │   │   └── uploads.ts           # Upload API calls
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx      # Left sidebar with menu
│   │   │   │   ├── Topbar.tsx       # Top header with logo/search
│   │   │   │   └── ChatLayout.tsx   # Main layout wrapper
│   │   │   ├── chat/
│   │   │   │   ├── MessageList.tsx  # Scrollable message list
│   │   │   │   ├── MessageItem.tsx  # Individual message
│   │   │   │   ├── ChatInput.tsx    # Multiline input area
│   │   │   │   └── FilePreview.tsx  # Image preview before send
│   │   │   └── common/
│   │   │       ├── Button.tsx       # Reusable button
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── Icon.tsx         # Icon wrapper
│   │   ├── hooks/
│   │   │   ├── useChat.ts           # Chat logic hook
│   │   │   ├── useFileUpload.ts     # File upload hook
│   │   │   └── useAutoScroll.ts     # Auto-scroll hook
│   │   ├── types/
│   │   │   └── index.ts             # Frontend TypeScript types
│   │   ├── utils/
│   │   │   └── formatters.ts        # Date/time formatters
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Tailwind imports
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md                        # Setup instructions
└── .gitignore
```

---

## 2. Database Schema Design

### Conversation Model

```typescript
{
  _id: ObjectId,
  title: string,              // e.g., "Default Conversation"
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model

```typescript
{
  _id: ObjectId,
  conversationId: ObjectId,   // Reference to Conversation
  role: 'user' | 'assistant',
  content: string,            // Message text
  attachments: [
    {
      fileName: string,       // Stored filename (unique)
      originalName: string,   // Original upload name
      mimeType: string,       // e.g., 'image/png'
      size: number,           // File size in bytes
      url: string            // Access URL path
    }
  ],
  createdAt: Date
}
```

**Indexes:**

- `conversationId` (for efficient message queries)
- `createdAt` (for sorting)

---

## 3. REST API Endpoints

### Base URL: `/api`

#### Conversations

- **GET** `/conversations`
  - Response: `{ conversations: Conversation[] }`
  - Returns all conversations (in our case, just the default one)

- **GET** `/conversations/:conversationId/messages`
  - Response: `{ messages: Message[] }`
  - Returns all messages for a conversation, sorted by createdAt ascending

#### Messages

- **POST** `/conversations/:conversationId/messages`
  - Request Body:
    ```typescript
    {
      content: string,
      attachments?: string[]  // Array of uploaded file IDs
    }
    ```
  - Response:
    ```typescript
    {
      userMessage: Message,
      assistantMessage: Message
    }
    ```
  - Flow:
    1. Save user message with attachments
    2. Generate AI response via service
    3. Save assistant message
    4. Return both messages

#### Uploads

- **POST** `/uploads`
  - Content-Type: `multipart/form-data`
  - Field: `file` (single file)
  - Accepts: `image/png`, `image/jpeg`, `image/gif`
  - Max size: 5MB
  - Response:
    ```typescript
    {
      fileId: string,
      fileName: string,
      originalName: string,
      mimeType: string,
      size: number,
      url: string
    }
    ```

---

## 4. AI Service Abstraction

### Interface Design

```typescript
interface AIService {
  generateResponse(
    userMessage: string,
    conversationHistory: Message[],
  ): Promise<string>;
}
```

### Implementations

#### MockAIService (Default)

- Returns predefined responses with slight delay
- Simulates thinking time (500-1000ms)
- Responses vary based on message content keywords
- No external dependencies

#### OpenAIService (Optional)

- Uses OpenAI API (gpt-3.5-turbo or gpt-4)
- Requires `OPENAI_API_KEY` environment variable
- Converts conversation history to OpenAI format
- Handles API errors gracefully

### Service Factory

```typescript
function createAIService(): AIService {
  const apiKey = process.env.OPENAI_API_KEY;
  return apiKey ? new OpenAIService(apiKey) : new MockAIService();
}
```

---

## 5. Frontend Component Architecture

### Component Hierarchy

```
App
└── ChatLayout
    ├── Sidebar
    │   └── Menu items (Home, Document, Design, etc.)
    ├── Topbar
    │   ├── Logo
    │   ├── SearchBar with filter
    │   ├── Pricing button
    │   └── Signup button
    └── ChatArea
        ├── MessageList
        │   └── MessageItem[] (user/assistant messages)
        └── ChatInput
            ├── FilePreview (conditional)
            ├── Textarea (multiline)
            ├── Plus button (file upload)
            └── Send button
```

### State Management Strategy

Using React hooks (no Redux needed for this scope):

**Main Chat State (`useChat` hook):**

```typescript
{
  messages: Message[],
  isLoading: boolean,
  error: string | null,
  conversationId: string
}
```

**File Upload State (`useFileUpload` hook):**

```typescript
{
  selectedFile: File | null,
  previewUrl: string | null,
  uploadedFileId: string | null,
  isUploading: boolean
}
```

---

## 6. UI Layout Design (Template.net Style)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Topbar: [Logo] [Search + Filter] [Pricing] [Signup]        │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ Sidebar  │  Message List (scrollable)                       │
│          │  ┌────────────────────────────────────────┐      │
│ - Home   │  │ User: Hello                            │      │
│ - Doc    │  │ [image thumbnail if attached]          │      │
│ - Design │  └────────────────────────────────────────┘      │
│ - Pres   │  ┌────────────────────────────────────────┐      │
│ - Image  │  │ Assistant: Hi! How can I help?         │      │
│ - Video  │  └────────────────────────────────────────┘      │
│ - More   │                                                  │
│          │                                                  │
│ Templates│                                                  │
│ Brand    │                                                  │
│ Projects │  ─────────────────────────────────────────────   │
│          │  Chat Input (sticky bottom)                      │
│ Sign in  │  ┌────────────────────────────────────────┐      │
│ Upgrade  │  │ [+] [Textarea...] [Send]               │      │
│          │  └────────────────────────────────────────┘      │
└──────────┴──────────────────────────────────────────────────┘
```

### Styling Approach

- Tailwind CSS utility classes
- Responsive design (mobile-first)
- Color scheme: Clean, modern (blues/grays)
- Smooth transitions and hover effects
- Message bubbles: User (right-aligned, blue), Assistant (left-aligned, gray)

---

## 7. File Upload Flow

### User Journey

1. User clicks **plus (+) button**
2. File picker opens (filtered to images only)
3. User selects image
4. **Preview appears** above input area with:
   - Thumbnail
   - File name
   - Remove button
5. User types message (optional)
6. User clicks **Send button**
7. Frontend uploads file to `/api/uploads`
8. Frontend sends message with file ID to `/api/messages`
9. Message appears in chat with image thumbnail

### Storage Strategy

- Files stored in `backend/uploads/` directory
- Unique filenames generated (timestamp + random string)
- Original names preserved in metadata
- Static file serving via Express
- URL format: `/uploads/{fileName}`

### Validation

- Client-side: File type and size check before upload
- Server-side: Multer validation (mimetype, size limit)
- Max file size: 5MB
- Allowed types: `image/png`, `image/jpeg`, `image/gif`

---

## 8. API Client Layer

### Axios Configuration

```typescript
// api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors consistently
    throw new Error(error.response?.data?.message || "An error occurred");
  },
);
```

### API Methods

```typescript
// api/conversations.ts
export const getConversations = () => apiClient.get("/conversations");

// api/messages.ts
export const getMessages = (conversationId: string) =>
  apiClient.get(`/conversations/${conversationId}/messages`);

export const sendMessage = (conversationId: string, data: SendMessageData) =>
  apiClient.post(`/conversations/${conversationId}/messages`, data);

// api/uploads.ts
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
```

---

## 9. Key Features Implementation

### Auto-scroll to Newest Message

```typescript
// useAutoScroll hook
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
```

### Loading State During Generation

- Show spinner/typing indicator when `isLoading === true`
- Disable send button during loading
- Display "AI is thinking..." message

### Disable Send on Empty Input

```typescript
const canSend =
  (content.trim().length > 0 || selectedFile !== null) && !isLoading;
```

### Message History Auto-load

```typescript
useEffect(() => {
  // On component mount
  loadConversation();
  loadMessages();
}, []);
```

---

## 10. Error Handling Strategy

### Backend

- Global error handler middleware
- Consistent error response format:
  ```typescript
  {
    success: false,
    message: string,
    error?: string  // Only in development
  }
  ```
- HTTP status codes:
  - 400: Bad request (validation errors)
  - 404: Not found
  - 500: Server error

### Frontend

- Try-catch blocks in API calls
- Error state in components
- User-friendly error messages
- Toast notifications for errors (optional)

---

## 11. Environment Variables

### Backend (`.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/chat-app

# AI Service (optional)
OPENAI_API_KEY=sk-...

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR=./uploads
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 12. Development Workflow

### Initial Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Clone repository
3. Install backend dependencies: `cd backend && npm install`
4. Install frontend dependencies: `cd frontend && npm install`
5. Copy `.env.example` to `.env` in both directories
6. Configure environment variables
7. Start backend: `npm run dev` (port 3000)
8. Start frontend: `npm run dev` (port 5173)
9. Access app at `http://localhost:5173`

### Database Initialization

- Backend automatically creates default conversation on first run
- No manual seeding required

---

## 13. Technology Stack Summary

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hooks** - State management

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File upload
- **dotenv** - Environment variables
- **cors** - CORS handling

---

## 14. Testing Considerations

### Manual Testing Checklist

- [ ] Send text-only message
- [ ] Send message with image attachment
- [ ] Upload different image formats (png, jpg, gif)
- [ ] Try uploading non-image file (should fail)
- [ ] Try uploading file > 5MB (should fail)
- [ ] Verify message history persists after refresh
- [ ] Test multiline input (Shift+Enter)
- [ ] Verify auto-scroll to newest message
- [ ] Test loading state during AI response
- [ ] Verify send button disabled when input empty
- [ ] Test file preview and remove functionality
- [ ] Check responsive design on mobile

---

## 15. Future Enhancements (Out of Scope)

- Multiple conversations support
- User authentication
- Real-time updates (WebSocket)
- Streaming AI responses
- Message editing/deletion
- Conversation search
- Export conversation history
- Dark mode toggle
- Voice input
- Code syntax highlighting in messages
- Markdown support in messages

---

## 16. Assumptions & Constraints

### Assumptions

1. Single anonymous user (no auth needed)
2. One default conversation created automatically
3. No streaming responses (complete response at once)
4. Files stored locally on server (not cloud storage)
5. Mock AI responses acceptable for demo
6. Modern browser support (ES6+)
7. Development environment has Node.js 18+ and MongoDB

### Constraints

1. Image uploads only (png, jpg, gif)
2. Max file size: 5MB
3. No real-time collaboration
4. No message encryption
5. No offline support
6. REST API only (no GraphQL)

---

## 17. Performance Considerations

- Lazy load messages if conversation grows large (pagination)
- Optimize image thumbnails (consider compression)
- Index MongoDB queries properly
- Use connection pooling for MongoDB
- Implement request rate limiting (future)
- Cache static assets
- Minimize bundle size with code splitting

---

## Next Steps

This architecture document provides the foundation for implementation. The next phase involves:

1. Setting up the project structure
2. Implementing backend API and database models
3. Building frontend components
4. Integrating frontend with backend
5. Testing and refinement

Ready to proceed with implementation when approved!
