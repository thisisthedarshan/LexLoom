# Changelog 🧵

All notable changes to the LexLoom project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-08
### Added
- **Custom Output Naming**: Added `--name <name>` CLI option to specify the base name for generated files.
- **Improved Filename Generation**: Default generated filenames now replace spaces in the grammar name with underscores (`_`) instead of just lowercasing.
- **Enhanced VS Code Scaffolding**: The VS Code extension scaffolding now uses a comprehensive set of template files (extensions, build configs, linting) and performs dynamic string replacements for project names, commands, and grammar scope names (`DDD{scope_name}`).
- **Rich Language Injections**: VS Code language injections now include a `contentName` property (formatted as `meta.embedded.block.<lang>`), enabling better scoping and themed backgrounds for injected code blocks.

## [1.0.2] - 2026-03-08
### Added
- **Flexible Space Handling**: Spaces in `start`, `end`, and `quote` fields are now automatically converted to flexible whitespace (`\s*`) in the generated output, allowing for better matching of constructs like `C = """`.
- **Numeric Sign Support**: All numeric presets now include support for optional leading signs (`[+-]?`).

### Fixed
- Fixed the octal numeric preset in VS Code (previously incorrectly mapped to decimal).
- Improved `lexloom.schema.json` validation for multiple injections by changing `injectLanguageArray` from `oneOf` to `anyOf`, resolving "Incorrect type" errors in certain IDE environments.

## [1.0.1] - 2026-03-08

### Added
- **Multi-Language Injection**: Support for embedding multiple languages (e.g., CSS and JS within HTML) in `blockMarker` and `stringMarker` rules.

## [1.0.0] - 2026-03-08

### Added
- **VS Code Extension Scaffolding**: Bootstrap a publishable VS Code extension project directly from a grammar file.
- **Universal Mappings**: Implemented a "Rosetta Stone" mapping system to gracefully degrade TextMate scopes for Vim and Notepad++.
- **Multi-Level Test Suite**: Added `simple`, `intermediate`, and `advanced` test grammars to verify core engine stability.
- **Rich Schema Documentation**: Refactored `lexloom.schema.json` to use `oneOf` patterns, providing hover descriptions for all scopes and rule types in the IDE.
- **Apache 2.0 Licensing**: Added license headers to all source files and established a `LICENSE` file.
- **Contributor Guide**: Created `CONTRIBUTING.md` with instructions for adding new platform generators.
- **NPM Deployment Readiness**: Created `.npmignore` to ensure a lightweight package distribution.

### Changed
- **CLI Migration**: Moved the CLI binary to the root (`lexloom.js`) for better NPM integration and local accessibility.
- **Core Refactor**: Migrated to a new intent-based grammar schema (`metadata` and `rules`).
- **Generator Improvements**:
    - **VS Code**: Added scope suffixing and word boundaries for numeric presets.
    - **Vim**: Implemented cluster-based language injection and specific regex escaping for symbols.
    - **Notepad++**: Added strict 2-digit delimiter prefixing and automatic style generation.
- **CLI Utilities**: Improved CLI with `--out` directory support and better error reporting.
- **Official Documentation**: Full rewrite of `README.md` with modern aesthetics and comprehensive Quick Start guides.

### Fixed
- Fixed regex over-escaping in the Vim generator for operators like `+` and `|`.
- Fixed Notepad++ UDL XML boilerplate and XML escaping for symbols.
- Resolved schema validation warnings in sample grammars.
