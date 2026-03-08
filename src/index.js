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

const path = require('path');
const { readJson, writeJson, writeFile } = require('./utils/fileSystem');
const generateVSCode = require('./generators/vscode');
const generateVim = require('./generators/vim');
const generateNotepadPP = require('./generators/notepadpp');
const scaffoldVSCodeExtension = require('./scaffold/vscodeExt');

/**
 * Main LexLoom Engine
 */
class LexLoom {
    constructor(options = {}) {
        this.options = options;
        this.outDir = options.outDir || path.join(process.cwd(), 'out');
    }

    async run(grammarPath) {
        console.log(`🚀 LexLoom: Processing ${grammarPath}...`);
        const grammar = await readJson(grammarPath);
        const { metadata, rules } = grammar;

        if (!metadata || !rules) {
            throw new Error("Invalid grammar format: 'metadata' and 'rules' are required.");
        }

        const name = metadata.name;
        const scopeName = metadata.scopeName;
        const fileTypes = (metadata.extensions || []).map(ext => ext.replace(/^\./, ''));

        const normalizedGrammar = {
            name,
            scopeName,
            fileTypes,
            rules
        };

        // 1. Generate VS Code
        const vscodeGrammar = generateVSCode(normalizedGrammar);
        const vscodePath = path.join(this.outDir, 'vscode', `${name.toLowerCase()}.tmLanguage.json`);
        await writeJson(vscodePath, vscodeGrammar);
        console.log(`✅ VS Code grammar generated: ${vscodePath}`);

        // 2. Generate Vim
        const vimGrammar = generateVim(normalizedGrammar);
        const vimPath = path.join(this.outDir, 'vim', `${name.toLowerCase()}.vim`);
        await writeFile(vimPath, vimGrammar);
        console.log(`✅ Vim syntax generated: ${vimPath}`);

        // 3. Generate Notepad++
        const nppGrammar = generateNotepadPP(normalizedGrammar);
        const nppPath = path.join(this.outDir, 'notepadpp', `${name.toLowerCase()}.xml`);
        await writeFile(nppPath, nppGrammar);
        console.log(`✅ Notepad++ UDL generated: ${nppPath}`);

        // 4. Scaffold VS Code Extension (if requested)
        if (this.options.scaffoldVSC) {
            const scaffoldDir = path.join(this.outDir, 'vscode-extension');
            await scaffoldVSCodeExtension(scaffoldDir, normalizedGrammar);

            // Inject grammar
            const targetSyntaxPath = path.join(scaffoldDir, 'syntaxes', `${name.toLowerCase()}.tmLanguage.json`);
            await writeJson(targetSyntaxPath, vscodeGrammar);
            console.log(`🎉 VS Code Extension scaffolded: ${scaffoldDir}`);
        }
    }
}

module.exports = LexLoom;
