const fs = require('fs-extra');
const path = require('path');
const { writeJson, writeFile } = require('../utils/fileSystem');

/**
 * Scaffolds a NodeJS-based VS Code Extension project.
 * @param {string} targetDir 
 * @param {object} grammar 
 */
async function scaffoldVSCodeExtension(targetDir, grammar) {
    const pkg = {
        name: grammar.name.toLowerCase().replace(/\s+/g, '-'),
        displayName: grammar.name,
        description: `Syntax highlighting for ${grammar.name}`,
        version: "0.0.1",
        engines: {
            vscode: "^1.75.0"
        },
        categories: ["Programming Languages"],
        contributes: {
            languages: [{
                id: grammar.name.toLowerCase(),
                aliases: [grammar.name],
                extensions: grammar.fileTypes.map(t => `.${t}`),
                configuration: "./language-configuration.json"
            }],
            grammars: [{
                language: grammar.name.toLowerCase(),
                scopeName: grammar.scopeName,
                path: `./syntaxes/${grammar.name.toLowerCase()}.tmLanguage.json`
            }]
        }
    };

    const langConfig = {
        comments: {
            lineComment: "//",
            blockComment: ["/*", "*/"]
        },
        brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
        autoClosingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: "\"", close: "\"" },
            { open: "'", close: "'" }
        ],
        surroundingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: "\"", close: "\"" },
            { open: "'", close: "'" }
        ]
    };

    await fs.ensureDir(targetDir);
    await writeJson(path.join(targetDir, 'package.json'), pkg);
    await writeJson(path.join(targetDir, 'language-configuration.json'), langConfig);

    // Create syntaxes dir
    const syntaxDir = path.join(targetDir, 'syntaxes');
    await fs.ensureDir(syntaxDir);
}

module.exports = scaffoldVSCodeExtension;
