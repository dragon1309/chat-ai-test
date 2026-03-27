import { useEffect, useRef, useState } from "react";
import { useChat } from "./hooks/useChat";
import { useFileUpload } from "./hooks/useFileUpload";
import { Message } from "./types";
import Icon from "./components/Icon";

function App() {
  const { messages, isLoading, error, sendMessage } = useChat();
  const {
    selectedFiles,
    isUploading,
    handleFileSelect,
    removeFile,
    clearFiles,
  } = useFileUpload();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if ((!inputValue.trim() && selectedFiles.length === 0) || isLoading) return;

    const fileIds = selectedFiles.map((f) => f.fileName);
    await sendMessage(inputValue, fileIds);
    setInputValue("");
    clearFiles();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-[rgb(242,245,253)]">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-8">
        <nav className="flex flex-col items-center">
          <SidebarIcon
            href="/src/assets/icon-navigation.svg#home"
            label="Home"
          />
          <SidebarIcon
            href="/src/assets/icon-navigation.svg#docs"
            label="Document"
          />
          <SidebarIcon
            href="/src/assets/icon-navigation.svg#design"
            label="Design"
          />
          <SidebarIcon
            href="/src/assets/icon-navigation.svg#presentation"
            label="Presentation"
          />
          <SidebarIcon
            href="/src/assets/icon-navigation.svg#gallery"
            label="Image"
          />
          <SidebarIcon
            href="/src/assets/icon-navigation.svg#video"
            label="Video"
          />
          <SidebarIcon
            href="/src/assets/icon-commons.svg#3-dots"
            label="More"
          />
          <SidebarIcon
            href="/src/assets/icon-navigation.svg#templates"
            label="Templates"
          />
          <SidebarIcon
            href="/src/assets/icon-navigation.svg#brand"
            label="Brand"
          />
          <SidebarIcon
            href="/src/assets/icon-navigation.svg#folder-open"
            label="Projects"
          />
        </nav>
        <div className="flex-1" />
        <div className="flex flex-col items-center space-y-4 pt-6 border-t border-gray-200">
          <SidebarIcon
            href="/src/assets/icon-commons.svg#solar-login"
            label="Sign in"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 flex items-center space-x-1">
            <Icon
              href="/src/assets/icon-commons.svg#crown"
              size={16}
              className="text-white"
            />
            <span>Upgrade</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">
              <Icon href="/src/assets/new-logo.svg"></Icon>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Pricing
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Sign up
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg">
                    Start a conversation with template.net AI
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <MessageBubble key={message._id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span>Generating...</span>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="max-w-3xl mx-auto">
              {/* File Chips */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedFiles.map((file) => (
                    <FileChip
                      key={file.fileName}
                      file={file}
                      onRemove={removeFile}
                    />
                  ))}
                </div>
              )}

              {/* Input Box */}
              <div className="flex items-end space-x-3 bg-gray-50 border border-gray-300 rounded-2xl p-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.md,.pdf,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  title="Upload file"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask template.net"
                  className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 text-gray-800 placeholder-gray-400"
                  rows={1}
                  disabled={isLoading}
                />

                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-lg flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    <span>Tools</span>
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-lg flex items-center space-x-1">
                    <span>Light AI</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={
                      (!inputValue.trim() && selectedFiles.length === 0) ||
                      isLoading
                    }
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarIcon({ href, label }: { href: string; label: string }) {
  return (
    <div className="relative group flex items-center justify-center h-[53px]">
      <button
        className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
        title={label}
      >
        <Icon href={href} size={20} />
        <span className="text-xs">{label}</span>
      </button>
      {/* Tooltip */}
      <span className="absolute left-full ml-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:3000";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl ${isUser ? "bg-indigo-600 text-white" : "bg-white border border-gray-200"} rounded-2xl px-5 py-3 shadow-sm`}
      >
        {message.attachments.length > 0 && (
          <div className="mb-3 space-y-2">
            {message.attachments.map((att, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm">
                {att.mimeType.startsWith("image/") ? (
                  <img
                    src={`${API_URL}${att.url}`}
                    alt={att.originalName}
                    className="max-w-xs rounded-lg"
                  />
                ) : (
                  <div
                    className={`flex items-center space-x-2 ${isUser ? "bg-indigo-700" : "bg-gray-100"} px-3 py-2 rounded-lg`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>{att.originalName}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function FileChip({
  file,
  onRemove,
}: {
  file: any;
  onRemove: (fileName: string) => void;
}) {
  return (
    <div className="flex items-center space-x-2 bg-gray-200 px-3 py-1 rounded-full text-sm">
      <span className="text-gray-700">{file.originalName}</span>
      <button
        onClick={() => onRemove(file.fileName)}
        className="text-gray-500 hover:text-gray-700"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default App;
