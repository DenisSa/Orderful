import { js2xml } from 'xml-js';
import { SimpleJson } from '../parsers/IParser';
import { FileOptions } from '../uploadService';
import { IConverter } from './IConverter';

export class XMLConverter implements IConverter {
  options: FileOptions;

  constructor(options: FileOptions) {
    this.options = options;
  }

  convert(input: SimpleJson): string {
    return `<?xml version="1.0" encoding="UTF-8" ?><root>${js2xml(input, { compact: true })}</root>`;
  }
}
