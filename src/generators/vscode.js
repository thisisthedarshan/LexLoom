/*
 * Copyright 2026 Darshan Patel
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

function processMarker(str) {
    if (!str) return '';
    return presets.escape(str).replace(/ /g, '\\s*');
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
                'number.octal': 'octal'
            };
            const rawRegex = presets.numbers[presetMap[r.presetId]] || presets.identifiers[r.presetId] || '';
            // Add boundaries to numeric presets. If it starts with an optional sign, use lookbehind.
            if (rawRegex.startsWith('[+-]?')) {
                rule.match = `(?<!\\w)${rawRegex}\\b`;
            } else {
                rule.match = `\\b${rawRegex}\\b`;
            }
            break;
        case 'lineMarker':
            rule.match = `${processMarker(r.start)}.*`;
            break;
        case 'blockMarker':
            rule.begin = processMarker(r.start);
            rule.end = processMarker(r.end);
            rule.patterns = [];
            const blockInjections = Array.isArray(r.injectLanguage) ? r.injectLanguage : (r.injectLanguage ? [r.injectLanguage] : []);
            blockInjections.forEach(inj => {
                if (inj.textmateScope) {
                    rule.patterns.push({ include: inj.textmateScope });
                }
            });
            if (rule.patterns.length === 0) delete rule.patterns;
            break;
        case 'stringMarker':
            rule.begin = processMarker(r.quote);
            rule.end = processMarker(r.quote);
            rule.patterns = [];

            const stringInjections = Array.isArray(r.injectLanguage) ? r.injectLanguage : (r.injectLanguage ? [r.injectLanguage] : []);
            stringInjections.forEach(inj => {
                if (inj.textmateScope) {
                    rule.patterns.push({ include: inj.textmateScope });
                }
            });

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
