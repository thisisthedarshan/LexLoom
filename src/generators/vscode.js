const { mapScope } = require('../mappings');
const presets = require('../presets');

/**
 * Generates a VS Code TextMate Grammar JSON.
 * @param {object} grammar 
 * @returns {object}
 */
function generateVSCode(grammar) {
    // Extract language ID from scopeName (e.g., "minipss" from "source.minipss")
    const langId = grammar.scopeName.split('.').pop();

    const tmLanguage = {
        name: grammar.name,
        scopeName: grammar.scopeName,
        fileTypes: grammar.fileTypes || [],
        patterns: grammar.rules.map(r => transformRule(r, langId)),
        repository: {}
    };

    return tmLanguage;
}

function transformRule(r, langId) {
    const rule = {};
    const baseScope = mapScope(r.universalScope, 'vscode');
    if (baseScope) {
        // Append language ID to prevent theme leaking
        rule.name = `${baseScope}.${langId}`;
    }

    switch (r.ruleType) {
        case 'wordList':
            rule.match = `\\b(${r.words.map(presets.escape).join('|')})\\b`;
            break;
        case 'symbolList':
            rule.match = `(${r.symbols.map(presets.escape).join('|')})`;
            break;
        case 'preset':
            const presetMap = {
                'number.decimal': 'decimal',
                'number.hex': 'hex',
                'number.binary': 'binary',
                'number.octal': 'decimal'
            };
            const rawRegex = presets.numbers[presetMap[r.presetId]] || presets.identifiers[r.presetId] || '';
            // Add word boundaries to numeric presets
            rule.match = `\\b${rawRegex}\\b`;
            break;
        case 'lineMarker':
            rule.match = `${presets.escape(r.start)}.*`;
            break;
        case 'blockMarker':
            rule.begin = presets.escape(r.start);
            rule.end = presets.escape(r.end);
            rule.patterns = [];
            if (r.injectLanguage && r.injectLanguage.textmateScope) {
                rule.patterns.push({ include: r.injectLanguage.textmateScope });
            }
            if (rule.patterns.length === 0) delete rule.patterns;
            break;
        case 'stringMarker':
            rule.begin = presets.escape(r.quote);
            rule.end = presets.escape(r.quote);
            rule.patterns = [];

            if (r.injectLanguage && r.injectLanguage.textmateScope) {
                rule.patterns.push({ include: r.injectLanguage.textmateScope });
            }

            if (r.escapeChar) {
                rule.patterns.push({
                    match: `${presets.escape(r.escapeChar)}.`,
                    name: `constant.character.escape.${langId}`
                });
            }

            if (rule.patterns.length === 0) delete rule.patterns;
            break;
    }

    return rule;
}

module.exports = generateVSCode;
