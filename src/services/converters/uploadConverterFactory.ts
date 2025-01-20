import { logger } from '../../logger';
import { EDIFormats } from '../../schemas/edi';
import { FileOptions } from '../primitives/FileOptions';
import { Ansix12Converter } from './ANSIX12Converter';
import { IConverter } from './IConverter';
import { JSONConverter } from './JSONConverter';
import { XMLConverter } from './XMLConverter';

export const converterFactory = (options: FileOptions): IConverter => {
  switch (options.target) {
    case EDIFormats.ANSI_X12:
      logger.info('Converting to ANSI_X12!');
      return new Ansix12Converter(options);
    case EDIFormats.JSON:
      logger.info('Converting to JSON!');
      return new JSONConverter(options);
    case EDIFormats.XML:
      logger.info('Converting to XML!');
      return new XMLConverter(options);
    case EDIFormats.PLAIN:
      logger.info('Converting to plain file!');
      return new Ansix12Converter(options);
    default:
      throw new Error('Could not recognize format to convert to!');
  }
};
