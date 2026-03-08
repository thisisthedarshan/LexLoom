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
