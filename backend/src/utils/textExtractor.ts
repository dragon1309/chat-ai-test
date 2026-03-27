import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extract text content from supported file types
 * @param filePath - Path to the file
 * @param mimeType - MIME type of the file
 * @returns Extracted text or null if not supported
 */
export async function extractText(
  filePath: string,
  mimeType: string,
): Promise<string | null> {
  try {
    // Text files (txt, md)
    if (mimeType === "text/plain" || mimeType === "text/markdown") {
      return fs.readFileSync(filePath, "utf-8");
    }

    // PDF files
    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    }

    // DOCX files
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }

    // Images - no text extraction (future: could use OCR or vision API)
    if (mimeType.startsWith("image/")) {
      return null;
    }

    return null;
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    return null;
  }
}

/**
 * Get MIME type from file extension
 * @param filename - Name of the file
 * @returns MIME type
 */
export function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".pdf": "application/pdf",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

export default { extractText, getMimeType };
