import { useRef, useState } from "react";
import { UploadedFile } from "../types";
import { FileChip } from "./FileChip";
import Icon from "./Icon";

interface InputAreaProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onFileSelect: (files: FileList | null) => void;
  onRemoveFile: (fileName: string) => void;
  onClearFiles: () => void;
  isLoading: boolean;
  isUploading: boolean;
  selectedFiles: UploadedFile[];
  selectedImageFile?: File | null;
  setSelectedImageFile?: (file: File | null) => void;
}

export function InputArea({
  inputValue,
  onInputChange,
  onSend,
  onFileSelect,
  onRemoveFile,
  onClearFiles,
  isLoading,
  isUploading,
  selectedFiles,
}: InputAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files);
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
  };

  return (
    <div className="bg-[#f9fafe] px-6 py-4">
      <div className="max-w-4xl mx-auto">
        {/* File Chips */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedFiles.map((file) => (
              <FileChip
                key={file.fileName}
                file={file}
                onRemove={onRemoveFile}
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
                  onClearFiles();
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
              onChange={(e) => onInputChange(e.target.value)}
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
                onChange={handleFileChange}
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
                onClick={onSend}
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
  );
}
