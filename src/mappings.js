/**
 * LexLoom Universal Scope Mapping (The Rosetta Stone)
 * * Maps highly granular TextMate-style scopes to the restricted, hardcoded 
 * highlight groups of varying editors (Graceful Degradation).
 * * Platform Notes:
 * - vscode: Uses standard TextMate scopes (engine will dynamically append `.{languageId}`).
 * - vim: Uses Vim's standard highlight groups (e.g., Statement, Type, String).
 * - emacs: Uses standard font-lock faces.
 * - npp: Uses Notepad++ User Defined Language (UDL) buckets.
 */

const universalScopeMap = {

    // --- KEYWORDS ---
    "keyword.control": {
        vscode: "keyword.control",            // Control flow (if, else, action, return)
        vim: "Statement",
        emacs: "font-lock-keyword-face",
        npp: "KEYWORD1"
    },
    "keyword.operator": {
        vscode: "keyword.operator",           // Operators (==, <=, +, -)
        vim: "Operator",
        emacs: "font-lock-builtin-face",
        npp: "OPERATOR"
    },
    "keyword.other": {
        vscode: "keyword.other",              // Modifiers and other keywords (static, virtual)
        vim: "Keyword",
        emacs: "font-lock-keyword-face",
        npp: "KEYWORD1"
    },

    // --- TYPES & CLASSES ---
    "support.type": {
        vscode: "support.type",               // Built-in primitive types (int, bit, bool)
        vim: "Type",
        emacs: "font-lock-type-face",
        npp: "KEYWORD2"
    },
    "entity.name.type": {
        vscode: "entity.name.type",           // Custom, user-defined types or classes
        vim: "Typedef",
        emacs: "font-lock-type-face",
        npp: "KEYWORD2"
    },

    // --- FUNCTIONS & METHODS ---
    "entity.name.function": {
        vscode: "entity.name.function",       // Function and method definitions
        vim: "Function",
        emacs: "font-lock-function-name-face",
        npp: "KEYWORD3"
    },

    // --- VARIABLES & IDENTIFIERS ---
    "variable.other": {
        vscode: "variable.other",             // Standard variables
        vim: "Identifier",
        emacs: "font-lock-variable-name-face",
        npp: null                             // NPP UDL lacks arbitrary variable highlighting
    },
    "variable.parameter": {
        vscode: "variable.parameter",         // Function parameters
        vim: "Identifier",
        emacs: "font-lock-variable-name-face",
        npp: null
    },

    // --- CONSTANTS & LITERALS ---
    "constant.numeric": {
        vscode: "constant.numeric",           // Numbers (decimal, hex, float)
        vim: "Number",
        emacs: "font-lock-constant-face",
        npp: "NUMBER"
    },
    "constant.language": {
        vscode: "constant.language",          // Built-in language constants (true, false, null)
        vim: "Boolean",
        emacs: "font-lock-constant-face",
        npp: "KEYWORD4"
    },

    // --- STRINGS ---
    "string.quoted.double": {
        vscode: "string.quoted.double",       // "Standard string"
        vim: "String",
        emacs: "font-lock-string-face",
        npp: "STRING"
    },
    "string.quoted.single": {
        vscode: "string.quoted.single",       // 'Single string'
        vim: "String",
        emacs: "font-lock-string-face",
        npp: "STRING"
    },
    "string.quoted.triple": {
        vscode: "string.quoted.triple",       // """Block string"""
        vim: "String",
        emacs: "font-lock-string-face",
        npp: "STRING"
    },

    // --- COMMENTS ---
    "comment.line": {
        vscode: "comment.line",               // Single-line comments (//)
        vim: "Comment",
        emacs: "font-lock-comment-face",
        npp: "COMMENTLINE"
    },
    "comment.block": {
        vscode: "comment.block",              // Multi-line block comments (/* */)
        vim: "Comment",
        emacs: "font-lock-comment-face",
        npp: "COMMENT"
    }
};

/**
 * Helper to get mapping with degradation
 * @param {string} scope 
 * @param {'vscode' | 'vim' | 'emacs' | 'npp'} target 
 * @returns {string|null}
 */
function mapScope(scope, target) {
    if (universalScopeMap[scope] && universalScopeMap[scope][target] !== undefined) {
        return universalScopeMap[scope][target];
    }

    // Simple degradation logic: take the first part of the scope
    const base = scope.split('.')[0];
    const baseMappings = {
        "keyword": { vscode: "keyword", vim: "Keyword", emacs: "font-lock-keyword-face", npp: "KEYWORD1" },
        "string": { vscode: "string", vim: "String", emacs: "font-lock-string-face", npp: "STRING" },
        "comment": { vscode: "comment", vim: "Comment", emacs: "font-lock-comment-face", npp: "COMMENT" },
        "constant": { vscode: "constant", vim: "Constant", emacs: "font-lock-constant-face", npp: "KEYWORD4" },
        "variable": { vscode: "variable", vim: "Identifier", emacs: "font-lock-variable-name-face", npp: null },
        "entity": { vscode: "entity", vim: "Statement", emacs: "font-lock-function-name-face", npp: "KEYWORD3" },
        "support": { vscode: "support", vim: "Type", emacs: "font-lock-type-face", npp: "KEYWORD2" }
    };

    if (baseMappings[base] && baseMappings[base][target] !== undefined) {
        return baseMappings[base][target];
    }

    const defaults = {
        vscode: "text",
        vim: "Normal",
        emacs: "default",
        npp: null
    };

    return defaults[target];
}

module.exports = { universalScopeMap, mapScope };