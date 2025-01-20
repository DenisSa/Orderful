import { SimpleJson } from '../parsers/IParser';
import { FileOptions } from '../primitives/FileOptions';

export interface IConverter {
  options: FileOptions;

  convert(input: SimpleJson): string | SimpleJson;
}
