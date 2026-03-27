import { useEffect, useRef } from "react";
import { Message as MessageType } from "../types";
import { Message } from "./Message";

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  error: string | null;
}

export function MessageList({ messages, isLoading, error }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-[850px] mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">Start a conversation with template.net AI</p>
          </div>
        )}
        {messages.map((message) => (
          <Message key={message._id} message={message} />
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
  );
}
