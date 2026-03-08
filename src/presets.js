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

/**
 * Common regex patterns and helpers for language definitions.
 */
const presets = {
    // Numeric patterns
    numbers: {
        hex: '0[xX][0-9a-fA-F]+',
        binary: '0[bB][01]+',
        decimal: '\\d+',
        float: '\\d*\\.\\d+'
    },

    // Comments
    comments: {
        line: (marker) => `${marker}.*`,
        block: (start, end) => `${start}[\\s\\S]*?${end}`
    },

    // Identifiers
    identifiers: {
        standard: '[a-zA-Z_][a-zA-Z0-9_]*'
    },

    // Escaping helper
    escape: (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
};

module.exports = presets;
