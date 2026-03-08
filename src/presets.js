/**
 * Common regex patterns and helpers for language definitions.
 */
const presets = {
    // Numeric patterns
    numbers: {
        hex: '0[xX][0-9a-fA-F]+',
        binary: '0[bB][01]+',
        decimal: '\\d+',
        float: '\\d*\\.\\d+'
    },

    // Comments
    comments: {
        line: (marker) => `${marker}.*`,
        block: (start, end) => `${start}[\\s\\S]*?${end}`
    },

    // Identifiers
    identifiers: {
        standard: '[a-zA-Z_][a-zA-Z0-9_]*'
    },

    // Escaping helper
    escape: (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
};

module.exports = presets;
