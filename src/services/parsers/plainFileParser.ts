import { FileOptions } from '../uploadService';
import { IParser } from './IParser';

export class PlainFileParser implements IParser {
  options: FileOptions;

  constructor(options: FileOptions) {
    this.options = options;
  }

  parse(fileContent: string) {
    const result: Record<string, Array<Record<string, string>>> = {};
    const lines = fileContent.split(this.options.separators.line);

    lines.forEach((line) => {
      const obj: Record<string, string> = {};
      const elements = line.split(this.options.separators.element);
      if (!elements.length || !elements[0]) {
        return;
      }
      const title = elements[0].trim();

      const elementBody = elements.slice(1);

      elementBody.forEach((element, eIndex) => {
        obj[`${title}${eIndex + 1}`] = element;
      });

      if (!result[`${title}`]) {
        result[`${title}`] = [];
      }
      result[`${title}`]?.push(obj);
    });

    return result;
  }
}
