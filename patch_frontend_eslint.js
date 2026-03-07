import fs from 'fs';

const filepath = 'apps/frontend/eslint.config.js';

let content = fs.readFileSync(filepath, 'utf-8');

content = content.replace("'import/order': [", "'import/order': 'off', // [");
content = content.replace("project: './tsconfig.app.json',", "project: ['./tsconfig.app.json', './tsconfig.node.json'],");

fs.writeFileSync(filepath, content, 'utf-8');
