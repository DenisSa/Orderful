import { z } from 'zod';

enum EDIFormats {
  JSON = 'JSON',
  XML = 'XML',
  ANSI_X12 = 'ANSI_X12',
  PLAIN = 'TXT', // This is for the sample provided in instructions, as it doesn't validate as ansi_x12
}

const supportedFormats = z.enum([EDIFormats.JSON, EDIFormats.XML, EDIFormats.ANSI_X12, EDIFormats.PLAIN]);

type EdiFormat = z.infer<typeof supportedFormats>;

// The intent of these is not to be exhaustive, but to quickly check if we should even bother
// doing more compute intensive validation/parsing for specific file format.
// If files are small this may not be neccessary, but I'm working under assumption that these can get large
const xmlSchema = z
  .string()
  .regex(/<\?xml/)
  .transform(() => {
    return EDIFormats.XML;
  });
const jsonSchema = z
  .string()
  .regex(/^\{[\S\s]*\}$/)
  .transform(() => {
    return EDIFormats.JSON;
  });
const ansiX12Schema = z
  .string()
  .regex(/^ISA[\S\s]*GS[\S\s]*ST/)
  .transform(() => {
    return EDIFormats.ANSI_X12;
  });

const plainSchema = z.string().transform(() => {
  return EDIFormats.PLAIN;
});

const supportedSchemas = z.union([xmlSchema, jsonSchema, ansiX12Schema, plainSchema]);

export { EdiFormat, EDIFormats, supportedFormats, supportedSchemas };
