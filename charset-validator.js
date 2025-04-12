function isInvisible(char) {
    const invisibleCharPattern = /[\x00-\x1F\x7F\u200B\u200C\u200D\u200E\u200F\u202A-\u202E\u2060\uFEFF\u00A0\u202F]/;
    return invisibleCharPattern.test(char);
}

const charsetRanges = {
    ascii: /^[\x00-\x7F]+$/,
    latin1: /^[\x00-\xFF]+$/,
    utf8mb4: (text) => {
        const invalidChars = [];
        try {
            // Check for surrogate pairs first
            for (let i = 0; i < text.length; i++) {
                const char = text.charCodeAt(i);
                if (char >= 0xD800 && char <= 0xDFFF) {
                    if (char >= 0xD800 && char <= 0xDBFF) {
                        // High surrogate
                        if (i + 1 >= text.length) {
                            invalidChars.push({
                                char: text[i],
                                code: char.toString(16).toUpperCase().padStart(4, '0')
                            });
                            break;
                        }
                        const nextChar = text.charCodeAt(i + 1);
                        if (nextChar < 0xDC00 || nextChar > 0xDFFF) {
                            invalidChars.push({
                                char: text[i],
                                code: char.toString(16).toUpperCase().padStart(4, '0')
                            });
                            break;
                        }
                        i++; // Skip the next character as we've already checked it
                    } else {
                        // Low surrogate without high surrogate
                        invalidChars.push({
                            char: text[i],
                            code: char.toString(16).toUpperCase().padStart(4, '0')
                        });
                        break;
                    }
                }
            }
            // If we found invalid chars, return them
            if (invalidChars.length > 0) {
                return invalidChars;
            }
            // If we get here, check if the text can be encoded
            new TextEncoder().encode(text);
            return [];
        } catch {
            // If encoding fails, return all characters as invalid
            return [...text].map(char => ({
                char: char,
                code: char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')
            }));
        }
    }
};

function validateAgainstCharset(text, charset) {
    if (!text || typeof text !== 'string') {
        return [];
    }

    const validation = charsetRanges[charset];
    if (!validation) {
        return [];
    }

    if (typeof validation === "function") {
        return validation(text);
    }

    return [...text]
        .filter(char => !validation.test(char))
        .map(char => ({
            char: char,
            code: char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')
        }));
}

export {
    validateAgainstCharset,
    isInvisible,
    charsetRanges
}; 