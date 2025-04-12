import { validateAgainstCharset, isInvisible } from './charset-validator.js';

describe('Charset Validator', () => {
    describe('ASCII Validation', () => {
        it('should validate pure ASCII text', () => {
            const text = 'Hello, World! 123';
            const result = validateAgainstCharset(text, 'ascii');
            expect(result).toHaveLength(0);
        });

        it('should detect non-ASCII characters', () => {
            const text = 'Hello, World! ©';
            const result = validateAgainstCharset(text, 'ascii');
            expect(result).toHaveLength(1);
            expect(result[0].char).toBe('©');
            expect(result[0].code).toBe('00A9');
        });

        it('should handle empty string', () => {
            const text = '';
            const result = validateAgainstCharset(text, 'ascii');
            expect(result).toHaveLength(0);
        });
    });

    describe('Latin-1 Validation', () => {
        it('should validate Latin-1 text', () => {
            const text = 'Hello, World! © é ñ';
            const result = validateAgainstCharset(text, 'latin1');
            expect(result).toHaveLength(0);
        });

        it('should detect non-Latin-1 characters', () => {
            const text = 'Hello, World! © é ñ 你好';
            const result = validateAgainstCharset(text, 'latin1');
            expect(result).toHaveLength(2);
            expect(result[0].char).toBe('你');
            expect(result[1].char).toBe('好');
        });

        it('should handle empty string', () => {
            const text = '';
            const result = validateAgainstCharset(text, 'latin1');
            expect(result).toHaveLength(0);
        });
    });

    describe('UTF-8 (mb4) Validation', () => {
        it('should validate UTF-8 text', () => {
            const text = 'Hello, World! © é ñ 你好 😊';
            const result = validateAgainstCharset(text, 'utf8mb4');
            expect(result).toHaveLength(0);
        });

        it('should handle empty string', () => {
            const text = '';
            const result = validateAgainstCharset(text, 'utf8mb4');
            expect(result).toHaveLength(0);
        });

        it('should handle invalid UTF-8 sequences', () => {
            // Create an invalid UTF-8 sequence
            const text = 'Hello' + String.fromCharCode(0xD800) + 'World';
            const result = validateAgainstCharset(text, 'utf8mb4');
            expect(result).toHaveLength(1);
        });
    });

    describe('Invisible Character Detection', () => {
        it('should detect invisible characters', () => {
            const invisibleChars = [
                '\u200B', // Zero-width space
                '\u200C', // Zero-width non-joiner
                '\u200D', // Zero-width joiner
                '\u200E', // Left-to-right mark
                '\u200F', // Right-to-left mark
                '\uFEFF', // Zero-width no-break space
                '\u00A0', // Non-breaking space
                '\u202F', // Narrow no-break space
                '\t',     // Tab
                '\n',     // Newline
                '\r'      // Carriage return
            ];

            invisibleChars.forEach(char => {
                expect(isInvisible(char)).toBe(true);
            });
        });

        it('should not detect visible characters as invisible', () => {
            const visibleChars = ['a', '1', '@', ' ', '©', '你'];
            visibleChars.forEach(char => {
                expect(isInvisible(char)).toBe(false);
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle null input', () => {
            const result = validateAgainstCharset(null, 'ascii');
            expect(result).toHaveLength(0);
        });

        it('should handle undefined input', () => {
            const result = validateAgainstCharset(undefined, 'ascii');
            expect(result).toHaveLength(0);
        });

        it('should handle non-string input', () => {
            const result = validateAgainstCharset(123, 'ascii');
            expect(result).toHaveLength(0);
        });

        it('should handle unknown charset', () => {
            const text = 'Hello, World!';
            const result = validateAgainstCharset(text, 'unknown');
            expect(result).toHaveLength(0);
        });
    });
}); 