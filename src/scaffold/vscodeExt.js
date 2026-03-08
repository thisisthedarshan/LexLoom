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

const fs = require('fs-extra');
const path = require('path');
const { writeJson, writeFile } = require('../utils/fileSystem');

/**
 * Scaffolds a NodeJS-based VS Code Extension project using template files.
 * @param {string} targetDir 
 * @param {object} grammar 
 * @param {string} baseName
 */
async function scaffoldVSCodeExtension(targetDir, grammar, baseName) {
    const utilsDir = path.join(__dirname, '../utils');
    const srcDir = path.join(targetDir, 'src');

    await fs.ensureDir(targetDir);
    await fs.ensureDir(srcDir);

    // 1. extension.ts
    let extensionTs = await fs.readFile(path.join(utilsDir, 'extension.ts'), 'utf8');
    extensionTs = extensionTs.replace(/DDD\{extension_name\}/g, grammar.name);
    await writeFile(path.join(srcDir, 'extension.ts'), extensionTs);

    // 2. .vscodeignore
    await fs.copy(path.join(utilsDir, 'vscodeignore'), path.join(targetDir, '.vscodeignore'));

    // 3. Config files
    await fs.copy(path.join(utilsDir, 'eslint.config.mjs'), path.join(targetDir, 'eslint.config.mjs'));
    await fs.copy(path.join(utilsDir, 'tsconfig.json'), path.join(targetDir, 'tsconfig.json'));
    await fs.copy(path.join(utilsDir, 'webpack.config.js'), path.join(targetDir, 'webpack.config.js'));

    // 4. package.json
    const pkgTemplate = await fs.readJson(path.join(utilsDir, 'ext.package.json'));
    pkgTemplate.name = baseName;
    pkgTemplate.displayName = grammar.name;
    pkgTemplate.description = `Syntax highlighting for ${grammar.name}`;
    // If the input JSON doesn't provide a version, default to 0.0.1
    pkgTemplate.version = grammar.version || "0.0.1";

    // Update DDD{extension_name} in contributions
    if (pkgTemplate.contributes && pkgTemplate.contributes.commands) {
        pkgTemplate.contributes.commands.forEach(cmd => {
            if (cmd.command) {
                cmd.command = cmd.command.replace(/DDD\{extension_name\}/g, baseName);
            }
        });
    }

    // Update DDD{scope_name} and DDD{extension_name} in grammars
    if (pkgTemplate.contributes && pkgTemplate.contributes.grammars) {
        pkgTemplate.contributes.grammars.forEach(g => {
            if (g.scopeName) {
                g.scopeName = g.scopeName.replace(/DDD\{scope_name\}/g, grammar.scopeName);
            }
            if (g.language) {
                g.language = g.language.replace(/DDD\{extension_name\}/g, baseName);
            }
            if (g.path) {
                g.path = g.path.replace(/DDD\{extension_name\}/g, baseName);
            }
        });
    }

    // Add language contribution
    pkgTemplate.contributes.languages = [{
        id: baseName,
        aliases: [grammar.name],
        extensions: grammar.fileTypes.map(t => `.${t}`),
        configuration: "./language-configuration.json"
    }];

    // Add grammar contribution
    pkgTemplate.contributes.grammars = [{
        language: baseName,
        scopeName: grammar.scopeName,
        path: `./syntaxes/${baseName}.tmLanguage.json`
    }];

    await writeJson(path.join(targetDir, 'package.json'), pkgTemplate);

    // 5. language-configuration.json (remains basically the same but good to keep structured)
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
    await writeJson(path.join(targetDir, 'language-configuration.json'), langConfig);

    // Create syntaxes dir
    await fs.ensureDir(path.join(targetDir, 'syntaxes'));
}

module.exports = scaffoldVSCodeExtension;
