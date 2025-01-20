import { SimpleJson } from '../parsers/IParser';
import { FileOptions } from '../primitives/FileOptions';
import { IConverter } from './IConverter';

export class Ansix12Converter implements IConverter {
  options: FileOptions;

  constructor(options: FileOptions) {
    this.options = options;
  }

  convert(input: SimpleJson): string {
    const result: string[] = [];

    for (const key in input) {
      if (input[key]) {
        const records = input[key];
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          let line = `${key}${this.options.separators.element}`;
          for (const field in record) {
            line += `${record[field]}${this.options.separators.element}`;
          }
          const res = line.slice(0, -1) + this.options.separators.line;
          result.push(res);
        }
      }
    }

    return result.join('');
  }
}
