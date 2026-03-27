import { useState } from "react";
import { UploadedFile } from "../types";
import { uploadFile as uploadFileAPI } from "../api/uploads";

export function useFileUpload() {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file
        const allowedTypes = [
          "text/plain",
          "text/markdown",
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/png",
          "image/jpeg",
        ];

        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File type not supported: ${file.name}`);
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File too large: ${file.name} (max 10MB)`);
        }

        // Upload file
        const uploadedFile = await uploadFileAPI(file);
        return { ...uploadedFile, file };
      });

      const uploaded = await Promise.all(uploadPromises);
      setSelectedFiles((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.fileName !== fileName));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setError(null);
  };

  return {
    selectedFiles,
    isUploading,
    error,
    handleFileSelect,
    removeFile,
    clearFiles,
  };
}

export default useFileUpload;
