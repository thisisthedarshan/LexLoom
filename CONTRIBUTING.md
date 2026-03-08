# Contributing to LexLoom 🧵

First off, thank you for considering contributing to LexLoom! It's people like you who make LexLoom such a powerful tool for the developer community.

## ✨ How Can I Contribute?

### Reporting Bugs
If you find a bug, please search the [issue tracker](https://github.com/thisisthedarshan/LexLoom/issues) to see if it has already been reported. If not, open a new issue and include:
* A clear, descriptive title.
* Steps to reproduce the bug.
* A copy of the grammar file that caused the issue.
* Expected vs. actual behavior.

### Suggesting Features
We love new ideas! If you have a feature request:
* Check if it's already been suggested.
* Explain **why** the feature would be useful.
* Provide examples of how the new grammar intent or generator should work.

### Adding New Generators
LexLoom is designed to be extensible. To add a new editor generator:
1. Create a new file in `src/generators/[editor].js`.
2. Implement a function that takes the normalized grammar and returns the platform-specific configuration.
3. Register the generator in `src/index.js`.
4. Add a test case in `tests/` that exercises your new generator.

## 🛠️ Development Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/thisisthedarshan/LexLoom.git
   cd LexLoom
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run tests**:
   ```bash
   node bin/lexloom.js tests/simple.json
   node bin/lexloom.js tests/intermediate.json
   node bin/lexloom.js tests/advanced.json
   ```

## 📝 Coding Standards

* **License**: All new source files MUST include the Apache License 2.0 header.
* **Style**: We use standard JavaScript (ES6+). Keep functions small and intent-focused.
* **Documentation**: Update the `lexloom.schema.json` if you add new rule types or presets. Ensure every new field has a `description`.
* **Tests**: Never submit a PR without verifying it against the existing test suite in `tests/`.

## 🚀 Pull Request Process

1. Create a branch named `feature/your-feature` or `fix/your-fix`.
2. Commit your changes with clear, descriptive messages.
3. Ensure the test suite passes.
4. Submit a PR against the `main` branch.
5. Wait for a review!

## 📄 License
By contributing to LexLoom, you agree that your contributions will be licensed under its **Apache License 2.0**.
