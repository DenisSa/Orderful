# Document Converter Take Home

## Running the application

### Run locally

`nvm use && npm i && npm run dev`

### Run with Docker

`docker build . -t orderful && docker run -p 3000:3000 -it orderful`

## Testing the application

### Unit Tests

`npm run test`

```
npm run test

PASS  src/services/parsers/plainFileParser.test.ts
PASS  src/services/converters/ANSIX12Converter.test.ts
PASS  src/services/uploadService.test.ts

Test Suites: 3 passed, 3 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        1.1 s, estimated 2 s
Ran all test suites.
```

I've created a few unit tests to demonstrate how I would approach testing - please note that I do not consider this number of tests / coverage complete or by any means exhaustive. Integration tests should be added as well.

### Functional testing

Sample CURL is provided below. You can find additional sample files under `src/testFiles/` directory.

Note that elementSeparator and lineSeparator are not required for input/output combinations that do not have delimiters

Target format can be JSON / XML / ANSI_X12 / TXT

```
curl --location 'localhost:3000/api/upload' \
--form 'file=@"src/testFiles/orderful_x12.txt"' \
--form 'elementSeparator="*"' \
--form 'lineSeparator="~"' \
--form 'targetFormat="JSON"'
```

## Solution description

I've chosen to create a simple API with express.

Once the file is uploaded, there are multiple layers of validation before we commit to parsing the file

1. Mime type validation - to filter out files we can not process, e.g pdf, xlsx, exe
2. Light schema validation with zod - my thinking here was to do a light pass to validate whether the file format uploaded is one of the formats we support. This is meant to avoid erroneously parsing large files

If the uploaded file is of one of supported formats, we attempt to parse it

1. I've chosen to use JSON as an intermediary format to parse to. My reasoning for it was to save coding time at expense of compute time, so I could convert any uploaded format to JSON, and then convert JSON to any supported format.
2. There are sets of parsers and converters. Converters work on JSON to convert to desired format, and parsers parse to JSON.
3. If I wanted to include another format, I would have to
   1. Update validator logic to accept new file format
   2. Write a format -> JSON parser implementing IParser
   3. Write a JSON -> format parser implementing IConverter
   4. Add new parser/converter to their respective factories

On Success, user will synchronously receive a response such as:

```
{
    "message": "File uploaded and processed successfully!",
    "content": {
        "ProductID": [
            {
                "ProductID1": "4",
                "ProductID2": "8",
                "ProductID3": "15",
                "ProductID4": "16",
                "ProductID5": "23"
            },
            {
                "ProductID1": "a",
                "ProductID2": "b",
                "ProductID3": "c",
                "ProductID4": "d",
                "ProductID5": "e"
            }
        ],
        "AddressID": [
            {
                "AddressID1": "42",
                "AddressID2": "108",
                "AddressID3": "3",
                "AddressID4": "14"
            }
        ],
        "ContactID": [
            {
                "ContactID1": "59",
                "ContactID2": "26"
            }
        ],
        "": [
            {}
        ]
    },
    "format": "JSON"
}
```

On error, user will get a response such as

```
{
   "message": "No path to convert file has been found",
   "error": "Separators are not provided but are required"
}
```
