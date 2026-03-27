import axios from "axios";
import { UploadedFile } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function uploadFile(file: File): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_URL}/uploads`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
}

export default { uploadFile };
