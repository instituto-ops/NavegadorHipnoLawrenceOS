import fs from 'fs';

const filepath = 'apps/frontend/eslint.config.js';

let content = fs.readFileSync(filepath, 'utf-8');

content = content.replace("'import/order': 'off', // [\n        'warn',\n        {\n          groups: [\n            'builtin',\n            'external',\n            'internal',\n            'parent',\n            'sibling',\n            'index',\n          ],\n          alphabetize: {\n            order: 'asc',\n            caseInsensitive: true,\n          },\n        },\n      ],", "'import/order': 'off',");

fs.writeFileSync(filepath, content, 'utf-8');
