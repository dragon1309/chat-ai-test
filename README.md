# AI Chat Module - Fullstack Application

A fullstack AI chat application built with React, TypeScript, Node.js, Express, MongoDB, and OpenAI. Features a clean UI inspired by Template.net with support for file uploads, text extraction, image generation, image description, and persistent chat history.

![Template.net Style Chat Interface](https://www.template.net/assets/icons/new-logo-1.svg)

## Features

- 🤖 **OpenAI Integration** - Real AI responses using GPT-4 and GPT-3.5-turbo
- 🎨 **Image Generation** - Create images from text prompts using DALL-E 3
- 👁️ **Image Description** - Analyze and describe uploaded images using GPT-4 Vision
- 💬 **Multiline Chat Input** - Support for complex messages with Shift+Enter
- 📎 **File Upload Support** - Upload txt, md, pdf, docx, png, jpg, jpeg files
- 📄 **Text Extraction** - Automatically extract text from documents for AI context
- 🖼️ **Image Preview** - Display uploaded images in chat messages with lightbox view
- 💾 **Persistent History** - All conversations stored in MongoDB
- 🎨 **Template.net UI** - Clean, modern interface matching Template.net design
- ⚡ **Auto-scroll** - Automatically scroll to newest messages
- 🔄 **Loading States** - Visual feedback with custom spinning loading icon during AI response generation
- 🧠 **Smart Mode Detection** - Automatically detects AI mode based on keywords and attachment types
- 📱 **Responsive Design** - Optimized layouts for desktop with custom breakpoints

## Tech Stack

### Frontend

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Custom SVG icons and animations

### Backend

- Node.js + Express + TypeScript
- MongoDB + Mongoose (database)
- OpenAI API (AI responses, image generation, vision)
- Multer (file uploads)
- pdf-parse (PDF text extraction)
- mammoth (DOCX text extraction)

## Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** v6+ (local or MongoDB Atlas)
- **OpenAI API Key** (get from [OpenAI Platform](https://platform.openai.com/))

## Project Structure

```
.
├── backend/                    # Backend server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API endpoints
│   │   │   ├── messages.ts     # Message and chat endpoints
│   │   │   ├── uploads.ts       # File upload endpoint
│   │   │   └── images.ts        # Image generation and description endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── openaiService.ts # OpenAI integration
│   │   │   ├── messageService.ts # Message operations
│   │   │   ├── conversationService.ts # Conversation operations
│   │   │   └── uploadService.ts # File upload handling
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript types
│   │   ├── app.ts             # Express app
│   │   └── server.ts          # Server entry point
│   ├── uploads/               # Uploaded files storage
│   └── package.json
│
├── frontend/                   # Frontend application
│   ├── src/
│   │   ├── api/               # API client layer
│   │   │   ├── messages.ts     # Message API client
│   │   │   ├── uploads.ts      # Upload API client
│   │   │   └── images.ts       # Image API client
│   │   ├── components/        # React components
│   │   │   ├── index.ts       # Component exports
│   │   │   ├── Header.tsx     # Header with logo and controls
│   │   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   │   ├── MessageList.tsx # Scrollable message container
│   │   │   ├── Message.tsx     # Individual message component
│   │   │   ├── InputArea.tsx  # Input field and buttons
│   │   │   ├── FileChip.tsx   # File attachment chip
│   │   │   └── Icon.tsx       # Custom SVG icon component
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useChat.ts     # Chat functionality hook
│   │   │   └── useFileUpload.ts # File upload hook
│   │   ├── types/             # TypeScript types
│   │   ├── assets/           # Static assets
│   │   │   ├── icon-navigation.svg
│   │   │   ├── loading-icon.svg
│   │   │   └── favicon.svg
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles with animations
│   └── package.json
└── README.md                   # This file
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-chat-module
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ai-chat

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=sk-your-openai-api-key-here

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

**Important:** You must provide a valid `OPENAI_API_KEY` for the application to work.

#### Start MongoDB

**Option A: Local MongoDB**

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env`

#### Start Backend Server

```bash
npm run dev
```

The backend will start at `http://localhost:3000`

You should see:

```
✓ Connected to MongoDB
✓ Default conversation ready: <conversation-id>
✓ Server running on port 3000
```

### 3. Frontend Setup

Open a new terminal:

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

## Usage Guide

### Sending Messages

1. **Text Message**: Type your message in the input area and click "Generate" or press Enter
2. **Multiline Message**: Press Shift+Enter to add new lines
3. **Message with Files**:
   - Click the plus (+) button
   - Select one or more files
   - File chips will appear above the input
   - Type your message (optional)
   - Click "Generate"

### Auto Mode Detection

The application automatically detects the appropriate AI mode based on your input:

- **Text Chat Mode**: Activated when typing general questions or text
- **Image Generation Mode**: Activated when using keywords like:
  - "generate", "create", "draw", "make image", "show me"
  - Words starting with: "generate", "create", "draw", "make"
- **Image Description Mode**: Activated when:
  - Uploading images (.png, .jpg, .jpeg, .gif, .webp)
  - Asking to describe, explain, or analyze images

### Supported File Types

| Type      | Extensions              | Text Extraction  | AI Processing          |
| --------- | ----------------------- | ---------------- | ---------------------- |
| Text      | `.txt`, `.md`           | ✅ Yes           | ✅ Included in context |
| Documents | `.pdf`, `.docx`         | ✅ Yes           | ✅ Included in context |
| Images    | `.png`, `.jpg`, `.jpeg` | ❌ Metadata only | ✅ GPT-4 Vision desc.  |

**Maximum File Size:** 10MB per file

### Image Generation

1. Type a prompt like "Generate an image of a sunset over mountains"
2. The AI will automatically detect image generation mode
3. Click "Generate" to create the image
4. The generated image will appear in the chat

### Image Description

1. Upload an image using the plus (+) button
2. Ask questions about the image like "Describe this image"
3. The AI will use GPT-4 Vision to analyze and describe the image
4. Responses are based on the actual image content

### File Upload Flow

1. User selects file(s) via plus button
2. Files are validated (type and size)
3. Files are uploaded to server
4. Text is extracted from supported formats
5. File chips appear in UI
6. User sends message
7. Extracted text is included in AI context
8. AI generates response considering file content

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Get Messages

```http
GET /messages
```

**Response:**

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "...",
        "conversationId": "default-conversation",
        "role": "user",
        "content": "Hello!",
        "attachments": [],
        "createdAt": "2026-03-26T07:01:00.000Z"
      }
    ]
  }
}
```

#### Send Message

```http
POST /messages
Content-Type: application/json

{
  "content": "Explain this document",
  "attachments": ["filename-123.pdf"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "userMessage": { ... },
    "assistantMessage": {
      "_id": "...",
      "role": "assistant",
      "content": "Based on the document...",
      "metadata": {
        "provider": "openai",
        "model": "gpt-3.5-turbo",
        "tokensUsed": 150
      }
    }
  }
}
```

**Note:** The application uses a single hardcoded conversation (`default-conversation`). All messages are stored and retrieved under this conversation ID.

#### Upload File

```http
POST /uploads
Content-Type: multipart/form-data

file: [binary data]
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fileId": "filename-123.pdf",
    "fileName": "filename-123.pdf",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 102400,
    "url": "/uploads/filename-123.pdf"
  }
}
```

#### Generate Image

```http
POST /images/generate
Content-Type: application/json

{
  "prompt": "A beautiful sunset over mountains",
  "size": "1024x1024"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "imageUrl": "data:image/png;base64,...",
    "revisedPrompt": "A serene sunset painting with orange and purple sky over mountain peaks"
  }
}
```

#### Describe Image

```http
POST /images/describe
Content-Type: application/json

{
  "imageUrl": "data:image/png;base64,...",
  "question": "What do you see in this image?"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "description": "I can see a beautiful sunset over mountain peaks..."
  }
}
```

## Architecture

### AI Service Abstraction

The application uses a service abstraction layer for AI operations:

- **Text Chat**: Uses GPT-3.5-turbo or GPT-4
- **Image Generation**: Uses DALL-E 3 with automatic prompt revision
- **Image Description**: Uses GPT-4 Vision for analyzing uploaded images

### Message Flow

1. **User sends message** with optional file attachments
2. **Backend saves user message** to MongoDB
3. **Backend detects AI mode** based on content and attachments
4. **Backend collects conversation history**
5. **Backend processes based on mode**:
   - Text: Extract text from files, call GPT
   - Image Gen: Call DALL-E 3
   - Image Desc: Call GPT-4 Vision with image
6. **Backend saves assistant response** with metadata
7. **Backend returns both messages** to frontend
8. **Frontend displays messages** with auto-scroll

### Text Extraction

- **TXT/MD**: Direct file read
- **PDF**: Uses `pdf-parse` library
- **DOCX**: Uses `mammoth` library
- **Images**: Metadata only + GPT-4 Vision description

### Data Models

**Conversation:**

```typescript
{
  _id: ObjectId,
  title: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Message:**

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
    extractedText?: string
  }],
  metadata?: {
    provider: 'openai',
    model: string,
    tokensUsed?: number
  },
  createdAt: Date
}
```

## UI Components

### Custom Icons

The application uses custom SVG icons located in `frontend/src/assets/`:

- **icon-navigation.svg**: Navigation and logo icon
- **loading-icon.svg**: Custom spinning loading animation

### Animations

CSS animations are defined in `frontend/src/index.css`:

```css
.animate-spin-slow {
  animation: spin 0.75s ease-in-out infinite;
}
```

### Typography

The application uses Inter font family for consistent typography across the interface.

## Development

### Backend Development

```bash
cd backend

# Start with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### MongoDB Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Ensure MongoDB is running

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### OpenAI API Error

```
Error: Failed to generate AI response
```

**Solution:**

- Verify `OPENAI_API_KEY` is set in backend `.env`
- Check API key is valid at [OpenAI Platform](https://platform.openai.com/)
- Ensure you have API credits available

### File Upload Fails

```
Error: File too large
```

**Solution:**

- Check file size (max 10MB)
- Verify file type is supported
- Ensure `uploads/` directory exists in backend

### CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

- Verify backend is running on port 3000
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS middleware is configured in backend

### Image Generation Fails

```
Error: Failed to generate image
```

**Solution:**

- Verify OpenAI API key has DALL-E 3 access
- Check prompt is not violating content policies
- Ensure you have sufficient API credits

## Project Assumptions

1. **Single User**: Application designed for one anonymous user
2. **One Conversation**: Single default conversation (expandable to multiple)
3. **No Authentication**: No user login required
4. **No Streaming**: AI responses returned complete (not streamed)
5. **Local File Storage**: Files stored on server filesystem
6. **OpenAI Required**: Real OpenAI API key required
7. **Modern Browsers**: Supports latest Chrome, Firefox, Safari, Edge
8. **Text Extraction**: Only txt, md, pdf, docx files have text extracted
9. **Smart Mode Detection**: AI mode automatically detected from keywords and attachment types

## Limitations

- No real-time collaboration
- No message editing or deletion
- No conversation search
- No dark mode
- No mobile app
- No voice input
- No markdown rendering in messages
- Image generation requires sufficient OpenAI credits

## Future Enhancements

- [ ] Streaming responses for faster UX
- [ ] Dark mode toggle
- [ ] Multiple conversations with sidebar navigation
- [ ] Message editing and deletion
- [ ] Markdown rendering in chat messages
- [ ] Mobile responsive design
- [ ] Conversation search functionality
- [ ] Export conversation to PDF/HTML
- [ ] Voice input with speech recognition
- [ ] Custom AI model selection (Claude, Gemini, etc.)
