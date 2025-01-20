import { SimpleJson } from '../parsers/IParser';
import { FileOptions } from '../uploadService';

export interface IConverter {
  options: FileOptions;

  convert(input: SimpleJson): string | SimpleJson;
}
