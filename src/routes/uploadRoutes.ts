// routes/uploadRoutes.ts

import { Router } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { UploadController } from '../controllers/uploadController';
import { logger } from '../logger';
import { UploadService } from '../services/uploadService';

const router = Router();
const uploadService = new UploadService();
const uploadController = new UploadController(uploadService);

const validMimeTypes = ['text/plain', 'text/csv', 'application/json'];

// TODO: Consider file upload size limits for production
const upload = multer({
  dest: 'uploads/',
  fileFilter: (_req, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (validMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      logger.warn(`Invalid file type only ${validMimeTypes} are allowed`);
      cb(null, false);
    }
  },
});

// We only accept a single file, multi file uploads are not accepted
// For production, we could decouple upload from parsing + retrieval of output if processing is expensive, then
// we could instead return job uuid
// which you could use to poll for result in /result endpoint
router.post('/upload', upload.single('file'), (req, res) => uploadController.uploadFile(req, res));

export default router;
