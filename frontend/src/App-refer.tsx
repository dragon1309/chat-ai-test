import { useEffect, useRef, useState } from "react";
import { useChat } from "./hooks/useChat";
import { useFileUpload } from "./hooks/useFileUpload";
import { Message } from "./types";
import Icon from "./components/Icon";

function App() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    generateImage,
    describeImage,
  } = useChat();
  const {
    selectedFiles,
    isUploading,
    handleFileSelect,
    removeFile,
    clearFiles,
  } = useFileUpload();
  const [inputValue, setInputValue] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detect AI mode based on input and attachments
  const detectAIMode = (): "chat" | "generate" | "describe" => {
    const hasImageAttachments = selectedFiles.some((file) =>
      file.mimeType.startsWith("image/"),
    );

    if (hasImageAttachments) {
      return "describe";
    }

    const lowerInput = inputValue.toLowerCase();
    const imageKeywords = [
      "generate image",
      "create image",
      "draw",
      "generate picture",
      "create picture",
      "make image",
      "generate a",
      "create a",
      "draw a",
      "show me a",
      "给我画",
      "生成图片",
      "创建图片",
      "画一个",
    ];

    const shouldGenerateImage = imageKeywords.some((keyword) =>
      lowerInput.includes(keyword),
    );

    return shouldGenerateImage ? "generate" : "chat";
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const mode = detectAIMode();

    if (mode === "chat") {
      // Send full attachment objects with extracted text
      const attachments = selectedFiles.map((f) => ({
        fileName: f.fileName,
        originalName: f.originalName,
        mimeType: f.mimeType,
        size: f.size,
        url: f.url,
        extractedText: f.extractedText,
      }));
      await sendMessage(inputValue, attachments);
    } else if (mode === "generate") {
      await generateImage(inputValue);
    } else if (mode === "describe") {
      // Find the first image file in the selected files
      const imageFile = selectedFiles.find((file) =>
        file.mimeType.startsWith("image/"),
      );

      if (!imageFile) {
        alert("Please upload an image first to describe it.");
        return;
      }

      const imageUrl = `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000"}/uploads/${imageFile.fileName}`;
      await describeImage(imageUrl, inputValue);
    }

    setInputValue("");
    clearFiles();
    setSelectedImageFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-[#f9fafe]">
      {/* Sidebar */}
      <aside className="w-[68px] bg-[rgb(242,245,253)] border-r border-gray-200 flex flex-col items-center py-6 space-y-8">
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
          <div className="flex flex-col items-center space-y-2">
            <button className="group w-12 h-12 rounded-[3.40282e38px] bg-[rgb(30,13,255)] hover:bg-[rgb(20,8,200)] flex items-center justify-center transition-all hover:scale-105 hover:shadow-lg">
              <Icon
                href="/src/assets/icon-commons.svg#crown"
                size={20}
                className="text-white"
              />
            </button>
            <span className="sidebar-text text-[#6b7280] group-hover:text-[#4b5563] transition-colors">
              Upgrade
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header
          id="header"
          className="bg-[rgb(249 250 254)] pl-0 xl:pl-[68px] py-4 flex items-center justify-between"
        >
          <div
            id="header-container"
            className="px-0 xl:px-12 flex-1 flex items-center justify-between"
          >
            <div id="logo" className="flex items-center space-x-4">
              <img
                src="/src/assets/new-logo.svg"
                alt="Template.net Logo"
                className="h-6 w-auto"
              />
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
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg header-btn">
                Pricing
              </button>
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg header-btn">
                Sign up
              </button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-[850px] mx-auto space-y-6">
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
                  <img
                    src="/src/assets/loading-icon.svg"
                    alt="Loading"
                    className="h-5 w-5 animate-spin-slow"
                  />
                  <span className="font-medium">Generating...</span>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-[#f9fafe] px-6 py-4">
            <div className="max-w-4xl mx-auto">
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

              {/* Selected Image Preview for Describe Mode */}
              {selectedImageFile && (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(selectedImageFile)}
                      alt="Selected for description"
                      className="max-w-xs rounded-xl shadow-md"
                    />
                    <button
                      onClick={() => {
                        setSelectedImageFile(null);
                        clearFiles();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
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
                </div>
              )}

              {/* Input Box */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm hover:border-indigo-300 transition-colors focus-within:border-indigo-500 focus-within:shadow-md">
                <div className="flex flex-col space-y-3">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask template.net"
                    className="w-full h-[58px] bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-400 text-base"
                    disabled={isLoading}
                  />

                  <div className="flex items-center justify-between">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".txt,.md,.pdf,.docx,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        handleFileSelect(e.target.files);
                        // Handle image preview
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          const firstFile = files[0];
                          if (firstFile.type.startsWith("image/")) {
                            setSelectedImageFile(firstFile);
                          }
                        }
                        // Reset input to allow selecting the same file again
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading || isLoading}
                      className="h-[38px] px-4 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                      title="Attach files"
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

                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isLoading}
                      className="h-[38px] px-6 bg-indigo-600 text-white font-semibold rounded-3xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                    >
                      <Icon
                        href="/src/assets/generate-btn.svg"
                        size={16}
                        className="text-white"
                      />
                      <span>Generate</span>
                    </button>
                  </div>
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
        <span className="sidebar-text">{label}</span>
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
        className={`max-w-2xl ${
          isUser
            ? "bg-[rgb(246, 248, 253)] text-[rgb(43, 54, 83)]"
            : "bg-[rgb(249 250 254)] "
        } rounded-2xl px-6 py-4`}
      >
        {!isUser && (
          <div className="font-medium text-sm mb-2 text-[rgb(43, 54, 83)]">
            Template.net
          </div>
        )}
        {message.type === "image" && message.imageUrl && (
          <div className="mb-4">
            <img
              src={message.imageUrl}
              alt={isUser ? "User uploaded image" : "Generated image"}
              className="max-w-sm rounded-xl shadow-md"
            />
          </div>
        )}

        {message.attachments.length > 0 && (
          <div className="mb-4 space-y-3">
            {message.attachments.map((att, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                {att.mimeType.startsWith("image/") ? (
                  <img
                    src={`${API_URL}${att.url}`}
                    alt={att.originalName}
                    className="max-w-sm rounded-xl shadow-md"
                  />
                ) : (
                  <div
                    className={`flex items-center space-x-3 ${
                      isUser ? "bg-[rgb(246, 248, 253)]" : "bg-gray-100"
                    } px-4 py-3 rounded-xl`}
                  >
                    <svg
                      className="w-5 h-5"
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
                    <span className="font-medium">{att.originalName}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        {/* <div
          className={`mt-2 text-xs ${
            isUser ? "text-indigo-200" : "text-gray-400"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div> */}
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
    <div className="flex items-center space-x-3 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-sm">
      <svg
        className="w-5 h-5 text-indigo-600"
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
      <span className="text-indigo-900 font-medium">{file.originalName}</span>
      <button
        onClick={() => onRemove(file.fileName)}
        className="text-indigo-400 hover:text-indigo-600 transition-colors"
      >
        <svg
          className="w-5 h-5"
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
