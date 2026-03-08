const fs = require('fs-extra');
const path = require('path');

/**
 * Ensures a directory exists, then writes JSON data to a file.
 * @param {string} filePath 
 * @param {object} data 
 */
async function writeJson(filePath, data) {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeJson(filePath, data, { spaces: 4 });
}

/**
 * Ensures a directory exists, then writes string data to a file.
 * @param {string} filePath 
 * @param {string} content 
 */
async function writeFile(filePath, content) {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
}

/**
 * Reads a JSON file.
 * @param {string} filePath 
 * @returns {Promise<object>}
 */
async function readJson(filePath) {
    return await fs.readJson(filePath);
}

module.exports = {
    writeJson,
    writeFile,
    readJson
};
