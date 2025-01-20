import { xml2js } from 'xml-js';
import { FileOptions } from '../primitives/FileOptions';
import { IParser } from './IParser';

export class XMLParser implements IParser {
  options: FileOptions;

  constructor(options: FileOptions) {
    this.options = options;
  }

  parse(fileContent: string) {
    // TODO: There is a bug here
    // Can not use xml2js because it seems to lose data on number of blank spaces in element
    // Leaving it as is for the sake of time, sorry!
    const result: Record<string, Array<Record<string, string>>> = {};
    const xml = xml2js(fileContent, { compact: true });

    if ('root' in xml) {
      for (const key in xml['root']) {
        const collection = xml['root'][key];
        const obj: Record<string, string> = {};

        for (const subkey in collection) {
          const value = collection[subkey]['_text'];
          //we don't know how many blank spaces were here because empty fields are truncated (thanks xml2js?)
          obj[subkey] = value ?? '';
          if (!result[`${key}`]) {
            result[`${key}`] = [];
          }
        }
        result[`${key}`]?.push(obj);
      }
    }
    return result;
  }
}
