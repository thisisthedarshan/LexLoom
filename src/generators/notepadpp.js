const { mapScope } = require('../mappings');

/**
 * Simple XML escape function correctly handles symbols like &, <, >.
 */
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&"']/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '"': return '&quot;';
            case "'": return '&apos;';
        }
    });
}

/**
 * Generates a Notepad++ User Defined Language (UDL) XML.
 * @param {object} grammar 
 * @returns {string}
 */
function generateNotepadPP(grammar) {
    const langName = grammar.name;
    const ext = (grammar.fileTypes || []).join(' ');

    // State for UDL components
    const keywordGroups = {
        KEYWORD1: [],
        KEYWORD2: [],
        KEYWORD3: [],
        KEYWORD4: []
    };
    const operators = [];
    const commentTags = []; // Format: 0// 1/* 2*/
    const stringTags = [];
    const delimiterStyles = [];

    const activeStyles = new Set(['DEFAULT']);
    let hasNumbers = false;
    let stringCount = 0;

    grammar.rules.forEach(r => {
        const nppGroup = mapScope(r.universalScope, 'npp');

        switch (r.ruleType) {
            case 'wordList':
                if (keywordGroups[nppGroup]) {
                    keywordGroups[nppGroup].push(...r.words);
                    activeStyles.add(nppGroup);
                }
                break;
            case 'symbolList':
                operators.push(...r.symbols.map(escapeXml));
                activeStyles.add('OPERATOR');
                break;
            case 'preset':
                if (r.presetId && r.presetId.startsWith('number.')) {
                    hasNumbers = true;
                    activeStyles.add('NUMBER');
                }
                break;
            case 'lineMarker':
                if (r.universalScope === 'comment.line') {
                    commentTags.push(`0${escapeXml(r.start)}`);
                    activeStyles.add('COMMENTLINE');
                }
                break;
            case 'blockMarker':
                if (r.universalScope === 'comment.block') {
                    commentTags.push(`1${escapeXml(r.start)}`);
                    commentTags.push(`2${escapeXml(r.end)}`);
                    activeStyles.add('COMMENT');
                }
                break;
            case 'stringMarker':
                // Notepad++ requires 2-digit prefixes for delimiters: 00/01, 02/03, etc.
                const startPrefix = (stringCount * 2).toString().padStart(2, '0');
                const endPrefix = (stringCount * 2 + 1).toString().padStart(2, '0');
                stringTags.push(`${startPrefix}${escapeXml(r.quote)}`);
                stringTags.push(`${endPrefix}${escapeXml(r.quote)}`);

                delimiterStyles.push({
                    name: `DELIMITER${stringCount + 1}`,
                    id: (14 + stringCount).toString(),
                    color: "A31515" // Standard dark red for strings
                });
                stringCount++;
                break;
        }
    });

    let xml = `<?xml version="1.0" encoding="Windows-1252" ?>\n`;
    xml += `<NotepadPlus>\n`;
    xml += `    <UserLang name="${escapeXml(langName)}" ext="${escapeXml(ext)}">\n`;
    xml += `        <Settings>\n`;
    xml += `            <Global highlighter="yes" />\n`;
    xml += `        </Settings>\n`;

    xml += `        <KeywordLists>\n`;
    // Word Groups
    Object.keys(keywordGroups).forEach((g, i) => {
        xml += `            <Keywords name="Groups${i + 1}">${keywordGroups[g].join(' ')}</Keywords>\n`;
    });
    // Operators
    xml += `            <Keywords name="Operators">${operators.join(' ')}</Keywords>\n`;
    // Comments
    xml += `            <Keywords name="Comments">${commentTags.join(' ')}</Keywords>\n`;
    // Strings (Delimiters)
    xml += `            <Keywords name="Delimiters">${stringTags.join(' ')}</Keywords>\n`;
    xml += `        </KeywordLists>\n`;

    // UDL Style Definitions
    const styleConfigs = {
        DEFAULT: { id: "11", color: "000000" },
        KEYWORD1: { id: "5", color: "0000FF" },
        KEYWORD2: { id: "6", color: "FF00FF" },
        KEYWORD3: { id: "7", color: "008000" },
        KEYWORD4: { id: "8", color: "808000" },
        COMMENT: { id: "1", color: "808080" },
        COMMENTLINE: { id: "2", color: "808080" },
        OPERATOR: { id: "10", color: "FF0000" },
        NUMBER: { id: "4", color: "FF0000" } // styleID="4" as requested
    };

    xml += `        <Styles>\n`;
    Object.keys(styleConfigs).forEach(key => {
        if (activeStyles.has(key)) {
            const style = styleConfigs[key];
            xml += `            <WordsStyle name="${key}" styleID="${style.id}" fgColor="${style.color}" bgColor="FFFFFF" fontName="" fontStyle="0" />\n`;
        }
    });

    // Dynamic Delimiter Styles (DELIMITER1, DELIMITER2, etc.)
    delimiterStyles.forEach(ds => {
        xml += `            <WordsStyle name="${ds.name}" styleID="${ds.id}" fgColor="${ds.color}" bgColor="FFFFFF" fontName="" fontStyle="0" />\n`;
    });

    xml += `        </Styles>\n`;

    xml += `    </UserLang>\n`;
    xml += `</NotepadPlus>\n`;

    return xml;
}

module.exports = generateNotepadPP;
