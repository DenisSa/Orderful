import { FileOptions } from '../uploadService';
import { IParser } from './IParser';

export class JSONParser implements IParser {
  options: FileOptions;

  constructor(options: FileOptions) {
    this.options = options;
  }

  parse(fileContent: string) {
    return JSON.parse(fileContent);
  }
}
