import { EDIFormats } from '../../schemas/edi';
import { FileOptions } from '../primitives/FileOptions';
import { Ansix12Converter } from './ANSIX12Converter';

describe('ANSIX12 Converter Test', () => {
  it('Should parse convert JSON to ANSIX12 format', () => {
    const input = {
      ProductID: [
        { ProductID1: '4', ProductID2: '8', ProductID3: '15', ProductID4: '16', ProductID5: '23' },
        { ProductID1: 'a', ProductID2: 'b', ProductID3: 'c', ProductID4: 'd', ProductID5: 'e' },
      ],
      AddressID: [{ AddressID1: '42', AddressID2: '108', AddressID3: '3', AddressID4: '14' }],
      ContactID: [{ ContactID1: '59', ContactID2: '26' }],
    };
    const expected = 'ProductID*4*8*15*16*23~ProductID*a*b*c*d*e~AddressID*42*108*3*14~ContactID*59*26~';

    const options: FileOptions = {
      separators: {
        element: '*',
        line: '~',
      },
      type: EDIFormats.PLAIN,
      target: EDIFormats.JSON,
    };

    const converter = new Ansix12Converter(options);
    const actual = converter.convert(input);

    expect(actual).toEqual(expected);
  });
});
