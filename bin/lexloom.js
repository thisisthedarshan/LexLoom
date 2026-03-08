#!/usr/bin/env node

const path = require('path');
const LexLoom = require('../src/index');

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
