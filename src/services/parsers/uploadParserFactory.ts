import { logger } from '../../logger';
import { EDIFormats } from '../../schemas/edi';
import { FileOptions } from '../primitives/FileOptions';
import { AnsiX12Parser } from './ansix12parser';
import { IParser } from './IParser';
import { JSONParser } from './jsonParser';
import { PlainFileParser } from './plainFileParser';
import { XMLParser } from './xmlParser';

export const parserFactory = (options: FileOptions): IParser => {
  switch (options.type) {
    case EDIFormats.ANSI_X12:
      return new AnsiX12Parser(options);
    case EDIFormats.JSON:
      logger.info('Parsing JSON!');
      return new JSONParser(options);
    case EDIFormats.XML:
      logger.info('Parsing XML!');
      return new XMLParser(options);
    case EDIFormats.PLAIN:
      logger.info('Parsing plain file!');
      return new PlainFileParser(options);
    default:
      throw new Error('Could not recognize format to parse from!');
  }
};
