# AI Chat Module - Fullstack Application

A fullstack AI chat application built with React, TypeScript, Node.js, Express, MongoDB, and OpenAI. Features a clean UI inspired by Template.net with support for file uploads, text extraction, and persistent chat history.

![Template.net Style Chat Interface](https://via.placeholder.com/800x400?text=AI+Chat+Module)

## Features

- 🤖 **OpenAI Integration** - Real AI responses using OpenAI API
- 💬 **Multiline Chat Input** - Support for complex messages with Shift+Enter
- 📎 **File Upload Support** - Upload txt, md, pdf, docx, png, jpg, jpeg files
- 📄 **Text Extraction** - Automatically extract text from documents for AI context
- 🖼️ **Image Preview** - Display uploaded images in chat messages
- 💾 **Persistent History** - All conversations stored in MongoDB
- 🎨 **Template.net UI** - Clean, modern interface matching Template.net design
- ⚡ **Auto-scroll** - Automatically scroll to newest messages
- 🔄 **Loading States** - Visual feedback during AI response generation

## Tech Stack

### Frontend

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)

### Backend

- Node.js + Express + TypeScript
- MongoDB + Mongoose (database)
- OpenAI API (AI responses)
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
│   │   ├── services/          # Business logic
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
│   │   ├── components/        # React components (in App.tsx)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   └── package.json
│
├── plans/                      # Architecture documentation
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

### Supported File Types

| Type      | Extensions              | Text Extraction       |
| --------- | ----------------------- | --------------------- |
| Text      | `.txt`, `.md`           | ✅ Yes                |
| Documents | `.pdf`, `.docx`         | ✅ Yes                |
| Images    | `.png`, `.jpg`, `.jpeg` | ❌ No (metadata only) |

**Maximum File Size:** 10MB per file

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

#### Get Conversations

```http
GET /conversations
```

**Response:**

```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "_id": "...",
        "title": "Default Conversation",
        "createdAt": "2026-03-26T07:00:00.000Z",
        "updatedAt": "2026-03-26T07:00:00.000Z"
      }
    ]
  }
}
```

#### Get Messages

```http
GET /conversations/:conversationId/messages
```

**Response:**

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "...",
        "conversationId": "...",
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
POST /conversations/:conversationId/messages
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

## Architecture

### Message Flow

1. **User sends message** with optional file attachments
2. **Backend saves user message** to MongoDB
3. **Backend collects conversation history**
4. **Backend extracts text** from uploaded files (if applicable)
5. **Backend calls OpenAI API** with message + context + extracted text
6. **Backend saves assistant response** with metadata
7. **Backend returns both messages** to frontend
8. **Frontend displays messages** with auto-scroll

### Text Extraction

- **TXT/MD**: Direct file read
- **PDF**: Uses `pdf-parse` library
- **DOCX**: Uses `mammoth` library
- **Images**: Metadata only (future: vision API support)

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

## Project Assumptions

1. **Single User**: Application designed for one anonymous user
2. **One Conversation**: Single default conversation (expandable to multiple)
3. **No Authentication**: No user login required
4. **No Streaming**: AI responses returned complete (not streamed)
5. **Local File Storage**: Files stored on server filesystem
6. **OpenAI Required**: Real OpenAI API key required (no mock service)
7. **Modern Browsers**: Supports latest Chrome, Firefox, Safari, Edge
8. **Text Extraction**: Only txt, md, pdf, docx files have text extracted

## Limitations

- No real-time collaboration
- No message editing or deletion
- No conversation search
- No dark mode
- No mobile app
- No voice input
- No markdown rendering in messages
- No code syntax highlighting
- Images not analyzed by AI (metadata only)
- No cloud storage integration

## Future Enhancements

- [ ] Multiple conversation support
- [ ] User authentication
- [ ] Real-time updates with WebSocket
- [ ] Streaming AI responses
- [ ] Message editing/deletion
- [ ] Conversation search
- [ ] Dark mode toggle
- [ ] Voice input
- [ ] Markdown support
- [ ] Code syntax highlighting
- [ ] Image analysis with vision API
- [ ] Cloud storage (S3, Cloudinary)
- [ ] Export conversation history
- [ ] Mobile responsive improvements

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:

- Check the troubleshooting section
- Review the architecture documentation in `plans/`
- Open an issue on GitHub

---

**Built with ❤️ using React, TypeScript, Node.js, MongoDB, and OpenAI**

Last Updated: March 26, 2026
