import { Router, Request, Response, NextFunction } from "express";
import { upload } from "../middleware/uploadMiddleware";
import { processUploadedFile } from "../services/uploadService";

const router = Router();

router.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const attachment = await processUploadedFile(req.file);

      res.json({
        success: true,
        data: {
          fileId: attachment.fileName,
          ...attachment,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
