#!/usr/bin/env node

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
const LexLoom = require('./src/index');

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
LexLoom: Cross-platform Syntax Highlighting Meta-Compiler

Usage:
  lexloom <grammar.json> [options]

Options:
  --out <dir>      Output directory (default: ./out)
  --scaffold-vsc   Scaffold a VS Code extension project
  --help, -h       Show this help message
    `);
    process.exit(0);
}

const grammarPath = path.resolve(args[0]);
const outDirArgIdx = args.indexOf('--out');
const outDir = outDirArgIdx !== -1 ? path.resolve(args[outDirArgIdx + 1]) : path.join(process.cwd(), 'out');
const scaffoldVSC = args.includes('--scaffold-vsc');

const loom = new LexLoom({ outDir, scaffoldVSC });

loom.run(grammarPath).catch(err => {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
});
