import fs from 'fs';

let content;

// electron/main.ts
content = fs.readFileSync('apps/frontend/electron/main.ts', 'utf-8');
content = content.replace('app.on(\'window-all-closed\', () => {', 'app.on(\'window-all-closed\', (): void => {');
content = content.replace('app.on(\'activate\', () => {', 'app.on(\'activate\', (): void => {');
fs.writeFileSync('apps/frontend/electron/main.ts', content, 'utf-8');

// electron/updater.ts
content = fs.readFileSync('apps/frontend/electron/updater.ts', 'utf-8');
content = content.replace('export function setupUpdater(win: BrowserWindow) {', 'export function setupUpdater(win: BrowserWindow): void {');
fs.writeFileSync('apps/frontend/electron/updater.ts', content, 'utf-8');
