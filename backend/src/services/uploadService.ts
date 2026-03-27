import path from "path";
import { IAttachment } from "../types";
import { extractText } from "../utils/textExtractor";

export async function processUploadedFile(
  file: Express.Multer.File,
): Promise<IAttachment> {
  const url = `/uploads/${file.filename}`;

  // Extract text if supported
  const filePath = file.path;
  const extractedText = await extractText(filePath, file.mimetype);

  const attachment: IAttachment = {
    fileName: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url,
    ...(extractedText && { extractedText }),
  };

  return attachment;
}

export default { processUploadedFile };
