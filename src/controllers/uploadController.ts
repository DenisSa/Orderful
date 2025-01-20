import { Request, Response } from 'express';
import fs from 'fs';
import { logger } from '../logger';
import { uploadBodySchema } from '../schemas/uploadRequest';
import { UploadService } from '../services/uploadService';

export class UploadController {
  constructor(private uploadService: UploadService) {}

  uploadFile(req: Request, res: Response): void {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
      }

      const body = uploadBodySchema.safeParse(req.body);

      if (!body.success) {
        logger.warn(`Parameters did not pass validation - ${body.error}`);
        res.status(400).json({ message: `Form data did not pass validation` });
        return;
      }

      const { targetFormat, elementSeparator, lineSeparator } = body.data;

      const options = {
        separators: { element: elementSeparator ?? '', line: lineSeparator ?? '' },
        target: targetFormat,
      };

      const filePath = req.file.path;

      try {
        const detectedFormat = this.uploadService.identifyFile(filePath, options);
        logger.info(`Detected file of ${detectedFormat} format`);

        const convertedData = this.uploadService.convertFile(filePath, { ...options, type: detectedFormat });

        res.status(200).json({
          message: 'File uploaded and processed successfully!',
          content: convertedData,
          format: targetFormat,
        });
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ message: `No path to convert file has been found`, error: error.message });
          return;
        }
        throw error;
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Error processing file.' });
    } finally {
      if (req.file && req.file.path) {
        fs.rmSync(req.file.path);
      }
    }
  }
}
