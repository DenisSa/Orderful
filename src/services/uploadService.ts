// service/uploadService.ts

import { readFileSync } from 'fs';
import { logger } from '../logger';
import { EdiFormat, EDIFormats, supportedSchemas } from '../schemas/edi';
import { converterFactory } from './converters/uploadConverterFactory';
import { parserFactory } from './parsers/uploadParserFactory';

type Separators = {
  element: string;
  line: string;
};

export interface FileOptions {
  separators: Separators;
  type?: EdiFormat;
  target: EdiFormat;
}

export class UploadService {
  identifyFile(filePath: string, options: FileOptions): EdiFormat {
    // Quick google search shows EDI files can be validated without
    // doing a full parse by checking for specific headers / features (hopefully applies to all formats?)

    //TODO Optimization: Read first 1kb of file only
    const fileContent = readFileSync(filePath, 'utf-8');
    const supportedSchema = supportedSchemas.safeParse(fileContent);

    if (!supportedSchema.success) {
      logger.warn(`Failed to validate ${filePath}, unsupported schema`);
      throw new Error(`Failed to detect schema, supported schemas are ${supportedSchemas.options}`);
    }

    const schema = supportedSchema.data;

    // Since we detect file format after the fact, we need to go back and make sure separators are not missing when needed
    if (areSeparatorsRequiredAndMissing(schema, options)) {
      logger.warn(`Schema ${schema} with target ${options.target} is missing separators`, {
        separators: options.separators,
      });
      throw new Error(`Separators are not provided but are required`);
    }

    return schema;
  }

  convertFile(filePath: string, options: FileOptions) {
    const fileContent = readFileSync(filePath, 'utf-8');

    const parser = parserFactory(options);
    const parsedInput = parser.parse(fileContent);

    const converter = converterFactory(options);
    return converter.convert(parsedInput);
  }
}

function doSeparatorsExist(options: FileOptions) {
  if (!options.separators) {
    return false;
  }

  if (
    !options.separators.element ||
    options.separators.element.length === 0 ||
    !options.separators.line ||
    options.separators.line.length === 0
  ) {
    return false;
  }

  return true;
}

function areSeparatorsRequiredAndMissing(schema: EDIFormats, options: FileOptions): boolean {
  if ((options.target === EDIFormats.ANSI_X12 || options.target === EDIFormats.PLAIN) && !doSeparatorsExist(options)) {
    return true;
  }

  if ((schema === EDIFormats.ANSI_X12 || schema === EDIFormats.PLAIN) && !doSeparatorsExist(options)) {
    return true;
  }

  return false;
}
