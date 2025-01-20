import { EDIFormats } from '../../schemas/edi';
import { FileOptions } from '../primitives/FileOptions';
import { PlainFileParser } from './plainFileParser';

const input = `ProductID*4*8*15*16*23~
ProductID*a*b*c*d*e~
AddressID*42*108*3*14~
ContactID*59*26~`;

const expectedJson = {
  ProductID: [
    {
      ProductID1: '4',
      ProductID2: '8',
      ProductID3: '15',
      ProductID4: '16',
      ProductID5: '23',
    },
    {
      ProductID1: 'a',
      ProductID2: 'b',
      ProductID3: 'c',
      ProductID4: 'd',
      ProductID5: 'e',
    },
  ],
  AddressID: [
    {
      AddressID1: '42',
      AddressID2: '108',
      AddressID3: '3',
      AddressID4: '14',
    },
  ],
  ContactID: [
    {
      ContactID1: '59',
      ContactID2: '26',
    },
  ],
};

const input2 = `ProductID*a*b*c*d*e~ProductID*a*b*c*d*e~ProductID*a*b*c*d*e~`;
const expectedJson2 = {
  ProductID: [
    {
      ProductID1: 'a',
      ProductID2: 'b',
      ProductID3: 'c',
      ProductID4: 'd',
      ProductID5: 'e',
    },
    {
      ProductID1: 'a',
      ProductID2: 'b',
      ProductID3: 'c',
      ProductID4: 'd',
      ProductID5: 'e',
    },
    {
      ProductID1: 'a',
      ProductID2: 'b',
      ProductID3: 'c',
      ProductID4: 'd',
      ProductID5: 'e',
    },
  ],
};

describe('Sample File Parser Test', () => {
  const testCases = [
    { input: input, expected: expectedJson },
    { input: input2, expected: expectedJson2 },
  ];
  testCases.forEach(({ input, expected }) => {
    it('Should parse simple sample file to JSON', () => {
      const options: FileOptions = {
        separators: {
          element: '*',
          line: '~',
        },
        type: EDIFormats.PLAIN,
        target: EDIFormats.JSON,
      };

      const parser = new PlainFileParser(options);
      const result = parser.parse(input);

      expect(result).toEqual(expected);
    });
  });
});
