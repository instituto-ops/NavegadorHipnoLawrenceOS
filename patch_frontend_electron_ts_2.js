import fs from 'fs';

const filepath = 'apps/frontend/tsconfig.node.json';

let content = fs.readFileSync(filepath, 'utf-8');

content = content.replace('"include": ["vite.config.ts"]', '"include": ["vite.config.ts", "electron/**/*.ts"]');

fs.writeFileSync(filepath, content, 'utf-8');
