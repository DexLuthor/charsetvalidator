# Charset Validator

A JavaScript tool for validating text against different character sets (ASCII, Latin-1, and UTF-8).

## Features

- Validate text against multiple character sets:
  - ASCII (0-127)
  - Latin-1 (0-255)
  - UTF-8 (full Unicode support)
- Detect invisible characters
- Detailed validation results with character codes
- Comprehensive test coverage

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd charset-validator
```

2. Install dependencies:
```bash
npm install
```

## Running Tests

The project uses Jest for testing. Several test commands are available:

1. Run all tests once:
```bash
npm test
```

2. Run tests in watch mode (useful during development):
```bash
npm run test:watch
```

3. Run tests with coverage report:
```bash
npm run test:coverage
```

## Test Coverage

The test suite covers the following scenarios:

### ASCII Validation
- Pure ASCII text validation
- Detection of non-ASCII characters
- Empty string handling

### Latin-1 Validation
- Latin-1 text validation
- Detection of non-Latin-1 characters
- Empty string handling

### UTF-8 Validation
- UTF-8 text validation
- Invalid UTF-8 sequence detection
- Empty string handling

### Invisible Character Detection
- Detection of various invisible characters
- Verification of visible characters

### Edge Cases
- Null input handling
- Undefined input handling
- Non-string input handling
- Unknown charset handling

## API Documentation

### `validateAgainstCharset(text, charset)`

Validates text against a specified character set.

**Parameters:**
- `text` (string): The text to validate
- `charset` (string): The character set to validate against ('ascii', 'latin1', or 'utf8mb4')

**Returns:**
Array of objects containing invalid characters and their codes:
```javascript
[
  {
    char: '©',
    code: '00A9'
  }
]
```

### `isInvisible(char)`

Checks if a character is invisible.

**Parameters:**
- `char` (string): The character to check

**Returns:**
Boolean indicating whether the character is invisible
