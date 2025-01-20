import { FileOptions } from '../uploadService';

export type SimpleJson = Record<string, Array<Record<string, string>>>;

export interface IParser {
  options: FileOptions;
  parse(fileContent: string): SimpleJson;
}
