# Fullstack Chat Application

A modern, fullstack chat application with AI-powered responses, built with React, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB. Features a clean UI inspired by template.net AI chat with support for multiline input, image uploads, and persistent conversation history.

![Chat Application](https://via.placeholder.com/800x400?text=Chat+Application+Screenshot)

## Features

- 🤖 **AI-Powered Responses** - Intelligent chat responses with pluggable AI service architecture
- 💬 **Multiline Chat Input** - Support for complex messages with Shift+Enter for new lines
- 📎 **Image Upload** - Upload and preview images (PNG, JPG, GIF) up to 5MB
- 💾 **Persistent History** - All conversations stored in MongoDB
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ⚡ **Real-time Updates** - Instant message display with auto-scroll
- 🔄 **Loading States** - Visual feedback during AI response generation
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

### Frontend

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type-safe backend code
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Multer** - File upload handling

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

## Project Structure

```
chat-app/
├── backend/                    # Backend server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Express middleware
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Server entry point
│   ├── uploads/               # Uploaded files storage
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/                   # Frontend application
│   ├── src/
│   │   ├── api/               # API client layer
│   │   ├── components/        # React components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── chat/          # Chat components
│   │   │   └── common/        # Reusable components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx            # Root component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env
│
└── README.md                   # This file
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chat-app
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
MONGODB_URI=mongodb://localhost:27017/chat-app

# AI Service Configuration (Optional)
# Leave empty to use mock responses
OPENAI_API_KEY=

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

**Environment Variables Explained:**

- `PORT` - Port number for the backend server (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `MONGODB_URI` - MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key (optional, uses mock responses if not provided)
- `MAX_FILE_SIZE` - Maximum file upload size in bytes (default: 5MB)
- `UPLOAD_DIR` - Directory for storing uploaded files

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

The backend server will start at `http://localhost:3000`

You should see:

```
✓ Connected to MongoDB
✓ Default conversation created
✓ Server running on port 3000
```

### 3. Frontend Setup

Open a new terminal window:

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

**Environment Variables Explained:**

- `VITE_API_URL` - Backend API base URL

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

You should see the chat interface with:

- Sidebar with menu items
- Top header with logo and search
- Chat area ready for messages
- Input area at the bottom

## Usage Guide

### Sending Messages

1. **Text Message**: Type your message in the input area and click "Send" or press Enter
2. **Multiline Message**: Press Shift+Enter to add new lines
3. **Message with Image**:
   - Click the plus (+) button
   - Select an image file (PNG, JPG, or GIF)
   - Preview will appear above the input
   - Type your message (optional)
   - Click "Send"

### Uploading Images

**Supported Formats:**

- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF (.gif)

**Maximum File Size:** 5MB

**Upload Process:**

1. Click the plus (+) button in the chat input
2. Select an image from your device
3. Preview appears with file name and size
4. Click the X button to remove if needed
5. Click "Send" to upload and send

### Viewing Conversation History

- All messages are automatically saved to MongoDB
- Refresh the page to see messages persist
- Messages are loaded automatically on page load
- Newest messages appear at the bottom with auto-scroll

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Get All Conversations

```http
GET /conversations
```

**Response:**

```json
{
  "conversations": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Default Conversation",
      "createdAt": "2026-03-26T07:00:00.000Z",
      "updatedAt": "2026-03-26T07:00:00.000Z"
    }
  ]
}
```

#### Get Messages for Conversation

```http
GET /conversations/:conversationId/messages
```

**Response:**

```json
{
  "messages": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "conversationId": "65f1a2b3c4d5e6f7g8h9i0j1",
      "role": "user",
      "content": "Hello!",
      "attachments": [],
      "createdAt": "2026-03-26T07:01:00.000Z"
    },
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "conversationId": "65f1a2b3c4d5e6f7g8h9i0j1",
      "role": "assistant",
      "content": "Hi! How can I help you today?",
      "attachments": [],
      "createdAt": "2026-03-26T07:01:01.000Z"
    }
  ]
}
```

#### Send Message

```http
POST /conversations/:conversationId/messages
Content-Type: application/json

{
  "content": "Hello, how are you?",
  "attachments": ["filename-123.png"]
}
```

**Response:**

```json
{
  "userMessage": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "conversationId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "role": "user",
    "content": "Hello, how are you?",
    "attachments": [
      {
        "fileName": "filename-123.png",
        "originalName": "photo.png",
        "mimeType": "image/png",
        "size": 102400,
        "url": "/uploads/filename-123.png"
      }
    ],
    "createdAt": "2026-03-26T07:02:00.000Z"
  },
  "assistantMessage": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "conversationId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "role": "assistant",
    "content": "I'm doing well, thank you for asking!",
    "attachments": [],
    "createdAt": "2026-03-26T07:02:01.000Z"
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
  "fileId": "filename-123.png",
  "fileName": "filename-123.png",
  "originalName": "photo.png",
  "mimeType": "image/png",
  "size": 102400,
  "url": "/uploads/filename-123.png"
}
```

## AI Service Configuration

The application uses a flexible AI service abstraction that supports multiple implementations.

### Using Mock Responses (Default)

By default, the app uses mock AI responses. No configuration needed.

**Mock Response Behavior:**

- Simulates thinking time (500-1000ms delay)
- Returns varied responses based on message keywords
- No external API calls or costs

### Using OpenAI

To enable real AI responses with OpenAI:

1. **Get an API Key**
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Navigate to API Keys section
   - Create a new API key

2. **Install OpenAI Package**

   ```bash
   cd backend
   npm install openai
   ```

3. **Configure Environment Variable**

   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   ```

4. **Restart Backend Server**
   ```bash
   npm run dev
   ```

The application will automatically detect the API key and use OpenAI instead of mock responses.

**OpenAI Configuration:**

- Model: `gpt-3.5-turbo` (can be changed in code)
- Max tokens: 500
- Temperature: 0.7
- Includes conversation history for context

### Adding Other AI Services

To add support for other AI services (Anthropic Claude, Google Gemini, etc.):

1. Create a new service class implementing the `AIService` interface
2. Add it to `src/services/ai/`
3. Update the service factory in your code
4. Add necessary environment variables

## Development

### Backend Development

```bash
cd backend

# Start development server with auto-reload
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

### Code Structure Guidelines

**Backend:**

- Models: Mongoose schemas and models
- Services: Business logic and data operations
- Routes: API endpoint definitions
- Middleware: Request processing and validation
- Types: Shared TypeScript interfaces

**Frontend:**

- Components: Reusable UI components
- Hooks: Custom React hooks for logic
- API: Backend communication layer
- Types: TypeScript interfaces
- Utils: Helper functions

## Testing

### Manual Testing Checklist

- [ ] Send a text-only message
- [ ] Send a message with an image
- [ ] Upload different image formats (PNG, JPG, GIF)
- [ ] Try uploading a non-image file (should fail)
- [ ] Try uploading a file larger than 5MB (should fail)
- [ ] Verify messages persist after page refresh
- [ ] Test multiline input with Shift+Enter
- [ ] Verify auto-scroll to newest message
- [ ] Test loading state during AI response
- [ ] Verify send button is disabled when input is empty
- [ ] Test file preview and remove functionality
- [ ] Check responsive design on mobile devices

### Testing with Different AI Services

**Mock Service:**

```bash
# Remove or comment out OPENAI_API_KEY in .env
npm run dev
```

**OpenAI Service:**

```bash
# Add OPENAI_API_KEY to .env
npm run dev
```

## Troubleshooting

### Common Issues

#### MongoDB Connection Failed

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

#### CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

- Verify backend is running on port 3000
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS middleware is configured in backend

#### File Upload Fails

```
Error: File too large
```

**Solution:**

- Check file size (max 5MB)
- Verify file type (PNG, JPG, GIF only)
- Ensure `uploads/` directory exists in backend

#### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

#### TypeScript Errors

```
Cannot find module or its corresponding type declarations
```

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

Enable detailed logging:

**Backend:**

```env
NODE_ENV=development
```

**Frontend:**
Check browser console for detailed error messages

## Production Deployment

### Backend Deployment

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Set production environment variables:**

   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=<production-mongodb-uri>
   OPENAI_API_KEY=<your-api-key>
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

3. **Update environment variables** for production API URL

### Deployment Platforms

**Recommended Platforms:**

- **Backend:** Railway, Render, Heroku, AWS EC2, DigitalOcean
- **Frontend:** Vercel, Netlify, AWS Amplify, Cloudflare Pages
- **Database:** MongoDB Atlas (free tier available)

## Project Assumptions

1. **Single User:** Application designed for one anonymous user
2. **One Conversation:** Single default conversation (expandable to multiple)
3. **No Authentication:** No user login or authentication required
4. **No Streaming:** AI responses returned complete (not streamed)
5. **Local File Storage:** Files stored on server filesystem (not cloud storage)
6. **Mock AI Default:** Uses mock responses unless OpenAI key provided
7. **Modern Browsers:** Supports latest versions of Chrome, Firefox, Safari, Edge
8. **Image Uploads Only:** Only image files supported for upload

## Future Enhancements

Potential features for future versions:

- [ ] Multiple conversation support
- [ ] User authentication and profiles
- [ ] Real-time updates with WebSocket
- [ ] Streaming AI responses
- [ ] Message editing and deletion
- [ ] Conversation search
- [ ] Export conversation history
- [ ] Dark mode toggle
- [ ] Voice input
- [ ] Code syntax highlighting
- [ ] Markdown support in messages
- [ ] File upload to cloud storage (S3, Cloudinary)
- [ ] Support for more file types (PDF, DOCX, etc.)
- [ ] Message reactions and threading
- [ ] Conversation sharing

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Contact: [your-email@example.com]
- Documentation: [link-to-docs]

## Acknowledgments

- UI design inspired by [template.net AI chat](https://www.template.net/ai-chat)
- Built with modern web technologies
- Thanks to the open-source community

---

**Built with ❤️ using React, TypeScript, Node.js, and MongoDB**

Last Updated: March 26, 2026
