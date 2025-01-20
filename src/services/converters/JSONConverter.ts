import { SimpleJson } from '../parsers/IParser';
import { FileOptions } from '../uploadService';
import { IConverter } from './IConverter';

export class JSONConverter implements IConverter {
  options: FileOptions;

  constructor(options: FileOptions) {
    this.options = options;
  }

  convert(input: SimpleJson): string | SimpleJson {
    return input;
  }
}
