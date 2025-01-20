import { EdiFormat } from '../../schemas/edi';

type Separators = {
  element: string;
  line: string;
};

export interface FileOptions {
  separators: Separators;
  type?: EdiFormat;
  target: EdiFormat;
}
