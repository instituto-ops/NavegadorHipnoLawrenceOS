import fs from 'fs';

const filepath = 'apps/frontend/tsconfig.node.json';

let content = fs.readFileSync(filepath, 'utf-8');
const obj = JSON.parse(content);
if (!obj.include) {
  obj.include = [];
}
if (!obj.include.includes("electron/**/*.ts")) {
  obj.include.push("electron/**/*.ts");
}
fs.writeFileSync(filepath, JSON.stringify(obj, null, 2), 'utf-8');
