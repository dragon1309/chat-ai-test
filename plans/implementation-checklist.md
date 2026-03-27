# Implementation Checklist

This document provides step-by-step implementation instructions for building the fullstack chat application.

---

## Phase 1: Project Setup

### 1.1 Initialize Project Structure

- [ ] Create root directory `chat-app/`
- [ ] Create `backend/` directory
- [ ] Create `frontend/` directory
- [ ] Create root `.gitignore` file
- [ ] Initialize git repository

### 1.2 Backend Initialization

- [ ] Navigate to `backend/` directory
- [ ] Run `npm init -y`
- [ ] Install production dependencies:
  ```bash
  npm install express mongoose cors dotenv multer
  ```
- [ ] Install development dependencies:
  ```bash
  npm install -D typescript @types/node @types/express @types/cors @types/multer ts-node nodemon
  ```
- [ ] Create `tsconfig.json` with appropriate settings
- [ ] Create `src/` directory structure
- [ ] Create `.env.example` file
- [ ] Create `.env` file (add to .gitignore)
- [ ] Add scripts to `package.json`:
  - `dev`: `nodemon --exec ts-node src/server.ts`
  - `build`: `tsc`
  - `start`: `node dist/server.js`

### 1.3 Frontend Initialization

- [ ] Navigate to `frontend/` directory
- [ ] Run `npm create vite@latest . -- --template react-ts`
- [ ] Install dependencies:
  ```bash
  npm install axios
  ```
- [ ] Install Tailwind CSS:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Configure `tailwind.config.js`
- [ ] Update `src/index.css` with Tailwind directives
- [ ] Create `.env.example` file
- [ ] Create `.env` file (add to .gitignore)
- [ ] Create `src/` directory structure

---

## Phase 2: Backend Implementation

### 2.1 Configuration Setup

- [ ] Create `src/config/environment.ts`
  - Export environment variables with defaults
  - Validate required variables
- [ ] Create `src/config/database.ts`
  - MongoDB connection function
  - Connection error handling
  - Connection success logging

### 2.2 Database Models

- [ ] Create `src/models/Conversation.ts`
  - Define Mongoose schema
  - Add timestamps
  - Export model
- [ ] Create `src/models/Message.ts`
  - Define Mongoose schema with attachments subdocument
  - Add conversationId reference
  - Add role enum validation
  - Add indexes
  - Export model

### 2.3 AI Service Layer

- [ ] Create `src/services/ai/AIService.ts`
  - Define interface with `generateResponse` method
- [ ] Create `src/services/ai/MockAIService.ts`
  - Implement AIService interface
  - Add simulated delay (500-1000ms)
  - Create varied responses based on keywords
  - Handle edge cases (empty input, etc.)
- [ ] Create `src/services/ai/OpenAIService.ts`
  - Implement AIService interface
  - Install `openai` package: `npm install openai`
  - Initialize OpenAI client with API key
  - Convert conversation history to OpenAI format
  - Handle API errors gracefully
  - Add timeout handling
- [ ] Create AI service factory function
  - Check for OPENAI_API_KEY
  - Return appropriate service implementation

### 2.4 Business Logic Services

- [ ] Create `src/services/conversationService.ts`
  - `getAllConversations()`: Fetch all conversations
  - `getConversationById(id)`: Fetch single conversation
  - `createDefaultConversation()`: Create default conversation if none exists
  - `ensureDefaultConversation()`: Get or create default conversation
- [ ] Create `src/services/messageService.ts`
  - `getMessagesByConversationId(conversationId)`: Fetch messages sorted by date
  - `createMessage(data)`: Create and save new message
  - `createUserMessage(conversationId, content, attachments)`: Helper for user messages
  - `createAssistantMessage(conversationId, content)`: Helper for assistant messages
- [ ] Create `src/services/uploadService.ts`
  - `saveFileMetadata(file)`: Save uploaded file info
  - `getFileUrl(fileName)`: Generate file access URL
  - `validateFileType(mimetype)`: Validate image types
  - `generateUniqueFileName(originalName)`: Create unique filename

### 2.5 Middleware

- [ ] Create `src/middleware/uploadMiddleware.ts`
  - Configure Multer with disk storage
  - Set destination to `uploads/` directory
  - Generate unique filenames
  - Add file filter for image types only
  - Set file size limit (5MB)
  - Export upload middleware
- [ ] Create `src/middleware/errorHandler.ts`
  - Global error handler middleware
  - Format error responses consistently
  - Log errors
  - Handle different error types (validation, not found, server)

### 2.6 API Routes

- [ ] Create `src/routes/conversations.ts`
  - `GET /` - Get all conversations
  - Add error handling
  - Add input validation
- [ ] Create `src/routes/messages.ts`
  - `GET /:conversationId/messages` - Get messages for conversation
  - `POST /:conversationId/messages` - Send message and get AI response
    - Validate request body
    - Save user message
    - Generate AI response
    - Save assistant message
    - Return both messages
  - Add error handling
- [ ] Create `src/routes/uploads.ts`
  - `POST /` - Upload file
  - Use upload middleware
  - Validate file exists
  - Return file metadata
  - Add error handling

### 2.7 Express App Setup

- [ ] Create `src/app.ts`
  - Initialize Express app
  - Add CORS middleware
  - Add JSON body parser
  - Add URL-encoded body parser
  - Serve static files from `uploads/` directory
  - Mount routes:
    - `/api/conversations` → conversations router
    - `/api/conversations/:conversationId/messages` → messages router
    - `/api/uploads` → uploads router
  - Add 404 handler
  - Add error handler middleware
  - Export app
- [ ] Create `src/server.ts`
  - Import app and database config
  - Connect to MongoDB
  - Ensure default conversation exists
  - Start Express server
  - Handle server errors
  - Log server start

### 2.8 TypeScript Types

- [ ] Create `src/types/index.ts`
  - Define `IConversation` interface
  - Define `IMessage` interface
  - Define `IAttachment` interface
  - Define `SendMessageRequest` type
  - Define `SendMessageResponse` type
  - Define `UploadResponse` type
  - Export all types

### 2.9 Utilities

- [ ] Create `src/utils/logger.ts` (optional)
  - Simple console logger with timestamps
  - Log levels (info, warn, error)
  - Export logger functions

### 2.10 Create uploads directory

- [ ] Create `backend/uploads/` directory
- [ ] Add `.gitkeep` file to uploads directory
- [ ] Add `uploads/*` to `.gitignore` (except .gitkeep)

---

## Phase 3: Frontend Implementation

### 3.1 TypeScript Types

- [ ] Create `src/types/index.ts`
  - Define `Conversation` type
  - Define `Message` type
  - Define `Attachment` type
  - Define `SendMessageData` type
  - Export all types

### 3.2 API Client Layer

- [ ] Create `src/api/client.ts`
  - Create Axios instance with base URL
  - Add request timeout
  - Add response interceptor for error handling
  - Add request interceptor for headers
  - Export configured client
- [ ] Create `src/api/conversations.ts`
  - `getConversations()`: GET /conversations
  - Export functions
- [ ] Create `src/api/messages.ts`
  - `getMessages(conversationId)`: GET /conversations/:id/messages
  - `sendMessage(conversationId, data)`: POST /conversations/:id/messages
  - Export functions
- [ ] Create `src/api/uploads.ts`
  - `uploadFile(file)`: POST /uploads with FormData
  - Export function

### 3.3 Utility Functions

- [ ] Create `src/utils/formatters.ts`
  - `formatTimestamp(date)`: Format date to readable string
  - `formatFileSize(bytes)`: Convert bytes to KB/MB
  - Export functions

### 3.4 Custom Hooks

- [ ] Create `src/hooks/useAutoScroll.ts`
  - Create ref for scroll target
  - useEffect to scroll on dependency change
  - Return ref
- [ ] Create `src/hooks/useFileUpload.ts`
  - State: selectedFile, previewUrl, uploadedFileId, isUploading, error
  - `handleFileSelect(file)`: Validate and set file, create preview URL
  - `handleFileRemove()`: Clear file and preview
  - `uploadFile()`: Upload to server, return file ID
  - Cleanup preview URL on unmount
  - Return state and functions
- [ ] Create `src/hooks/useChat.ts`
  - State: messages, isLoading, error, conversationId
  - `loadConversation()`: Fetch default conversation
  - `loadMessages()`: Fetch messages for conversation
  - `sendMessage(content, attachments)`: Send message and update state
  - useEffect to load data on mount
  - Return state and functions

### 3.5 Common Components

- [ ] Create `src/components/common/Button.tsx`
  - Props: children, onClick, disabled, variant, className
  - Tailwind styling with variants (primary, secondary)
  - Disabled state styling
- [ ] Create `src/components/common/LoadingSpinner.tsx`
  - Simple animated spinner
  - Tailwind CSS animation
- [ ] Create `src/components/common/Icon.tsx` (optional)
  - Wrapper for icons (can use heroicons or lucide-react)
  - Install icon library: `npm install lucide-react`

### 3.6 Layout Components

- [ ] Create `src/components/layout/Sidebar.tsx`
  - Static menu items array
  - Render menu sections:
    - Main items (Home, Document, Design, Presentation, Image, Video, More)
    - Secondary items (Templates, Brand, Projects)
    - Bottom items (Sign in, Upgrade)
  - Tailwind styling
  - Hover effects
  - Icons for each item
- [ ] Create `src/components/layout/Topbar.tsx`
  - Logo section
  - Search bar with filter icon
  - Pricing button
  - Signup button
  - Responsive design
  - Tailwind styling
- [ ] Create `src/components/layout/ChatLayout.tsx`
  - Props: children
  - Grid layout: Sidebar | Main content
  - Topbar at top
  - Children in main area
  - Responsive breakpoints

### 3.7 Chat Components

- [ ] Create `src/components/chat/MessageItem.tsx`
  - Props: message (Message type)
  - Conditional styling based on role (user/assistant)
  - Display message content
  - Display attachments (image thumbnails)
  - Display timestamp
  - User messages: right-aligned, blue background
  - Assistant messages: left-aligned, gray background
  - Tailwind styling
- [ ] Create `src/components/chat/MessageList.tsx`
  - Props: messages, isLoading
  - Scrollable container
  - Map messages to MessageItem components
  - Loading indicator when isLoading
  - Empty state when no messages
  - Auto-scroll ref at bottom
  - Tailwind styling
- [ ] Create `src/components/chat/FilePreview.tsx`
  - Props: file, previewUrl, onRemove
  - Display image thumbnail
  - Display file name and size
  - Remove button
  - Tailwind styling
- [ ] Create `src/components/chat/ChatInput.tsx`
  - Props: onSendMessage, disabled
  - State: inputValue
  - Use useFileUpload hook
  - Textarea for multiline input
  - Plus button for file upload (hidden file input)
  - Send button (disabled when empty and no file)
  - FilePreview component (conditional)
  - Handle Enter key (send) vs Shift+Enter (newline)
  - Handle file selection
  - Handle send click:
    - Upload file if selected
    - Call onSendMessage with content and file ID
    - Clear input and file
  - Sticky positioning at bottom
  - Tailwind styling

### 3.8 Main App Component

- [ ] Create `src/App.tsx`
  - Use useChat hook
  - Render ChatLayout
  - Pass Sidebar and Topbar to layout
  - Render MessageList with messages and loading state
  - Render ChatInput with sendMessage handler
  - Error handling UI
  - Loading state on initial load

### 3.9 Styling

- [ ] Update `src/index.css`
  - Add Tailwind directives
  - Add custom scrollbar styles
  - Add global styles
  - Add animation keyframes if needed
- [ ] Configure `tailwind.config.js`
  - Extend theme colors
  - Add custom spacing if needed
  - Configure content paths

### 3.10 Environment Configuration

- [ ] Create `.env.example`
  ```
  VITE_API_URL=http://localhost:3000/api
  ```
- [ ] Create `.env` with actual values

---

## Phase 4: Integration & Testing

### 4.1 Backend Testing

- [ ] Start MongoDB service
- [ ] Start backend server: `npm run dev`
- [ ] Verify server starts without errors
- [ ] Test database connection
- [ ] Test default conversation creation
- [ ] Test API endpoints with Postman/Thunder Client:
  - GET /api/conversations
  - GET /api/conversations/:id/messages
  - POST /api/uploads (with image file)
  - POST /api/conversations/:id/messages

### 4.2 Frontend Testing

- [ ] Start frontend dev server: `npm run dev`
- [ ] Verify app loads without errors
- [ ] Check console for errors
- [ ] Test UI rendering:
  - Sidebar displays correctly
  - Topbar displays correctly
  - Chat area displays correctly
  - Input area displays correctly

### 4.3 End-to-End Testing

- [ ] Test sending text-only message
- [ ] Verify message appears in UI
- [ ] Verify AI response appears
- [ ] Test sending message with image
- [ ] Verify image preview before send
- [ ] Verify image thumbnail in message
- [ ] Test file upload validation (wrong type, too large)
- [ ] Test multiline input (Shift+Enter)
- [ ] Test auto-scroll to newest message
- [ ] Refresh page and verify messages persist
- [ ] Test loading states
- [ ] Test error states
- [ ] Test responsive design on different screen sizes

### 4.4 Bug Fixes & Refinements

- [ ] Fix any bugs discovered during testing
- [ ] Improve UI/UX based on testing
- [ ] Optimize performance if needed
- [ ] Add polish (transitions, hover effects, etc.)

---

## Phase 5: Documentation & Deployment Prep

### 5.1 Documentation

- [ ] Create comprehensive README.md (see separate file)
- [ ] Document API endpoints
- [ ] Document environment variables
- [ ] Add code comments where needed
- [ ] Create setup instructions

### 5.2 Code Quality

- [ ] Review code for consistency
- [ ] Remove console.logs (except intentional logging)
- [ ] Remove unused imports
- [ ] Format code consistently
- [ ] Add error handling where missing

### 5.3 Deployment Preparation

- [ ] Create production build scripts
- [ ] Test production builds locally
- [ ] Document deployment steps
- [ ] Create .env.example files with all required variables
- [ ] Update .gitignore files

---

## Phase 6: Optional Enhancements

### 6.1 OpenAI Integration

- [ ] Obtain OpenAI API key
- [ ] Add OPENAI_API_KEY to .env
- [ ] Test OpenAI service
- [ ] Verify responses are working
- [ ] Add error handling for API failures

### 6.2 UI Polish

- [ ] Add loading skeleton for messages
- [ ] Add toast notifications for errors
- [ ] Add confirmation dialogs where needed
- [ ] Improve mobile responsiveness
- [ ] Add keyboard shortcuts

### 6.3 Performance Optimization

- [ ] Implement message pagination if needed
- [ ] Optimize image loading
- [ ] Add lazy loading for images
- [ ] Minimize bundle size
- [ ] Add caching strategies

---

## Completion Checklist

Before considering the project complete, verify:

- [ ] All core features are working
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Messages persist after page refresh
- [ ] File uploads work correctly
- [ ] AI responses are generated
- [ ] UI matches design requirements
- [ ] Code is clean and documented
- [ ] README is complete and accurate
- [ ] .env.example files are up to date
- [ ] Project can be set up from scratch following README

---

## Estimated Implementation Order

1. **Backend Core** (2-3 hours)
   - Setup, models, database connection
2. **Backend Services** (2-3 hours)
   - AI service, business logic, routes
3. **Frontend Core** (2-3 hours)
   - Setup, API client, types, hooks
4. **Frontend UI** (3-4 hours)
   - Layout components, chat components, styling
5. **Integration & Testing** (2-3 hours)
   - Connect frontend to backend, test all features
6. **Documentation & Polish** (1-2 hours)
   - README, code cleanup, final testing

**Total: 12-18 hours** for a complete, polished implementation

---

## Tips for Implementation

1. **Start with backend**: Get the API working first before building UI
2. **Test incrementally**: Test each feature as you build it
3. **Use TypeScript strictly**: Don't use `any` types
4. **Keep components small**: Break down complex components
5. **Handle errors gracefully**: Always show user-friendly error messages
6. **Use environment variables**: Never hardcode URLs or keys
7. **Follow the architecture**: Stick to the planned structure
8. **Commit frequently**: Save your progress regularly
9. **Read error messages**: They usually tell you exactly what's wrong
10. **Ask for help**: If stuck, review the architecture document

---

## Common Issues & Solutions

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check connection string in .env
- Verify network access (if using Atlas)

### CORS Errors

- Verify CORS middleware is configured
- Check frontend API URL matches backend
- Ensure credentials are included if needed

### File Upload Issues

- Check uploads directory exists
- Verify file size limits
- Check file type validation
- Ensure static file serving is configured

### TypeScript Errors

- Run `npm install` to ensure all types are installed
- Check tsconfig.json configuration
- Verify import paths are correct

### Build Errors

- Clear node_modules and reinstall
- Check for missing dependencies
- Verify TypeScript version compatibility

---

Ready to implement! Follow this checklist step by step for a successful build.
