# LexLoom

LexLoom is a cross-platform syntax highlighting meta-compiler that abstracts the complexity of writing regex-heavy grammar files for different editors.

## Key Features
- **🧠 Regex-Free Authoring**: Define language constructs by intent.
- **🌍 Write Once, Highlight Anywhere**: Generate highlighters for VS Code, Vim, and Notepad++.
- **⚡ VS Code Extension Scaffolding**: Bootstrap a ready-to-use extension project from your grammar.
- **🔋 Batteries-Included Presets**: Built-in regex patterns for common needs like hex, binary, and decimals.

## Installation
```bash
npm install
```

## Usage
```bash
node bin/lexloom.js <grammar.json> [--out <dir>] [--scaffold-vsc]
```

### Example
```bash
node bin/lexloom.js sample-grammar.json --scaffold-vsc
```

This will generate:
- `out/vscode/`: TextMate `.tmLanguage.json`
- `out/vim/`: Vim `.vim` syntax script
- `out/notepadpp/`: Notepad++ `.xml` UDL
- `out/vscode-extension/`: A complete VS Code extension project.

## Grammar Schema
Use `schema/lexloom.schema.json` in VS Code to get instant validation and IntelliSense for your grammar files.
