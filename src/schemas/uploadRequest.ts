import { z } from 'zod';
import { supportedFormats } from './edi';

const uploadBodySchema = z.object({
  elementSeparator: z.string().optional(),
  lineSeparator: z.string().optional(),
  targetFormat: supportedFormats,
});

export { uploadBodySchema };
