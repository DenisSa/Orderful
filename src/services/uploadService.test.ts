import { EDIFormats } from '../schemas/edi';
import { FileOptions, UploadService } from './uploadService';

describe('Upload service tests', () => {
  const testCases = [
    { filePath: __dirname + '/../testFiles/orderful_json.txt', expected: EDIFormats.JSON },
    { filePath: __dirname + '/../testFiles/orderful_string.txt', expected: EDIFormats.PLAIN },
    { filePath: __dirname + '/../testFiles/orderful_x12.txt', expected: EDIFormats.ANSI_X12 },
    { filePath: __dirname + '/../testFiles/orderful_xml.txt', expected: EDIFormats.XML },
    {
      filePath: __dirname + '/../testFiles/240910-orderful-take-home-test-file (1).txt',
      expected: EDIFormats.ANSI_X12,
    },
  ];

  const separators = [
    {
      element: '',
      line: '',
    },
    {
      element: '*',
      line: '',
    },
    {
      element: '',
      line: '*',
    },
  ];

  testCases.forEach(({ filePath, expected }) => {
    it(`Should identiy input as ${expected}`, () => {
      const options: FileOptions = {
        separators: {
          element: '*',
          line: '~',
        },
        target: EDIFormats.JSON,
      };

      const service = new UploadService();

      const actual = service.identifyFile(filePath, options);

      expect(actual).toEqual(expected);
    });

    separators.forEach(({ element, line }) => {
      it('Should throw exception when separator is required', () => {
        const options: FileOptions = {
          separators: {
            element,
            line,
          },
          target: EDIFormats.ANSI_X12, //This will mean it should always throw
        };

        const service = new UploadService();

        expect(() => {
          service.identifyFile(filePath, options);
        }).toThrow('Separators are not provided but are required');
      });
    });
  });
});
