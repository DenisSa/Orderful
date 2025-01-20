import { FileOptions } from '../primitives/FileOptions';

export type SimpleJson = Record<string, Array<Record<string, string>>>;

export interface IParser {
  options: FileOptions;
  parse(fileContent: string): SimpleJson;
}
