import { Message as MessageType } from "../types";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
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
      </div>
    </div>
  );
}
