# Updated Requirements - AI Chat Module

## Adjusted Scope

### Focus: Chat Module Only

- Build the chat interface matching Template.net screenshot
- No full application layout (no complex sidebar/topbar)
- Focus on the chat conversation area

### Enhanced File Support

**Supported File Types:**

- Text files: `.txt`, `.md`
- Documents: `.pdf`, `.docx`
- Images: `.png`, `.jpg`, `.jpeg`

**Text Extraction:**

- Extract text from txt, md, pdf, docx files
- Include extracted text in AI context
- Store extracted text with message

**Image Handling:**

- Store image metadata
- Prepare for future image-aware AI support
- Display image preview in chat

### OpenAI Integration

- Use real OpenAI API key from environment variables
- No mock service needed
- Include file content in context where applicable
- Store provider/model metadata with responses

### Message Flow

1. User uploads file(s) - show file chips
2. User types message
3. User clicks Generate
4. Save user message with attachments
5. Collect conversation history
6. Extract text from supported files
7. Call OpenAI with context + extracted text
8. Save assistant response with metadata
9. Return both messages
10. Display in UI with auto-scroll

## Updated Tech Stack

### Backend

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Multer for file uploads
- OpenAI SDK
- **pdf-parse** for PDF text extraction
- **mammoth** for DOCX text extraction

### Frontend

- React + TypeScript + Vite
- Tailwind CSS
- Axios
- Simple chat UI (no complex layout)

## Updated Project Structure

```
ai-chat-module/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── environment.ts
│   │   ├── models/
│   │   │   ├── Conversation.ts
│   │   │   └── Message.ts
│   │   ├── routes/
│   │   │   ├── messages.ts
│   │   │   └── uploads.ts
│   │   ├── services/
│   │   │   ├── openaiService.ts
│   │   │   ├── messageService.ts
│   │   │   └── uploadService.ts
│   │   ├── utils/
│   │   │   └── textExtractor.ts      # NEW: Extract text from files
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   └── uploadMiddleware.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── uploads/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── messages.ts
│   │   │   └── uploads.ts
│   │   ├── components/
│   │   │   ├── ChatContainer.tsx     # Main chat component
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageItem.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── FileChip.tsx          # NEW: File chip display
│   │   │   └── LoadingSpinner.tsx
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   └── useFileUpload.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md
```

## Updated Data Models

### Message Model

```typescript
{
  _id: ObjectId,
  conversationId: ObjectId,
  role: 'user' | 'assistant',
  content: string,
  attachments: [{
    fileName: string,
    originalName: string,
    mimeType: string,
    size: number,
    url: string,
    extractedText?: string    // NEW: For txt, md, pdf, docx
  }],
  metadata?: {                // NEW: AI provider metadata
    provider: 'openai',
    model: string,
    tokensUsed?: number
  },
  createdAt: Date
}
```

## Text Extraction Strategy

### Supported Formats

- **TXT/MD**: Direct file read
- **PDF**: Use `pdf-parse` library
- **DOCX**: Use `mammoth` library
- **Images**: Store metadata only (future: vision API)

### Implementation

```typescript
// utils/textExtractor.ts
async function extractText(
  filePath: string,
  mimeType: string,
): Promise<string | null> {
  if (mimeType === "text/plain" || mimeType === "text/markdown") {
    return fs.readFileSync(filePath, "utf-8");
  }
  if (mimeType === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  return null; // Images - no text extraction
}
```

## OpenAI Integration

### Context Building

```typescript
const messages = [
  ...conversationHistory.map((msg) => ({
    role: msg.role,
    content: msg.content,
  })),
  {
    role: "user",
    content:
      userMessage +
      (extractedText ? `\n\nAttached file content:\n${extractedText}` : ""),
  },
];

const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages,
  max_tokens: 1000,
});
```

## UI Adjustments

### Simplified Layout

- No complex sidebar/topbar
- Focus on chat area only
- Clean, minimal design matching Template.net

### File Chips

- Display uploaded files as chips before sending
- Show file name, type icon, size
- Remove button for each chip
- Support multiple files

### Loading States

- Disable input during generation
- Show "Generating..." indicator
- Disable Generate button when empty

## Implementation Checklist

### Backend

- [ ] Setup Express + TypeScript project
- [ ] Configure MongoDB connection
- [ ] Create Conversation and Message models
- [ ] Install text extraction libraries (pdf-parse, mammoth)
- [ ] Implement textExtractor utility
- [ ] Setup Multer for file uploads (support all file types)
- [ ] Create OpenAI service with context building
- [ ] Implement message routes (GET, POST)
- [ ] Implement upload route
- [ ] Add error handling middleware

### Frontend

- [ ] Setup React + Vite + TypeScript
- [ ] Configure Tailwind CSS
- [ ] Create ChatContainer component
- [ ] Create MessageList with auto-scroll
- [ ] Create MessageItem (user/assistant styling)
- [ ] Create ChatInput with multiline support
- [ ] Create FileChip component
- [ ] Implement useChat hook
- [ ] Implement useFileUpload hook (multiple files)
- [ ] Create API client layer
- [ ] Add loading and error states

### Integration

- [ ] Test file upload for all types
- [ ] Test text extraction
- [ ] Test OpenAI integration
- [ ] Test message persistence
- [ ] Test auto-scroll
- [ ] Test error handling

## Environment Variables

### Backend

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-chat
OPENAI_API_KEY=sk-...
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads
```

### Frontend

```env
VITE_API_URL=http://localhost:3000/api
```

## Dependencies

### Backend

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "openai": "^4.20.0",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/multer": "^1.4.11",
    "@types/pdf-parse": "^1.1.4",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

### Frontend

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.0",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

## Ready to Generate

All planning is complete. Ready to switch to Code mode and generate the full project.
