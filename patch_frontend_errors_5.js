import fs from 'fs';

let content;

// electron/updater.ts
content = fs.readFileSync('apps/frontend/electron/updater.ts', 'utf-8');
content = content.replace("export function setupUpdater() {", "export function setupUpdater(win: BrowserWindow | null): void {");
content = content.replace("void void autoUpdater.checkForUpdatesAndNotify();", "void autoUpdater.checkForUpdatesAndNotify();");
content = content.replace("console.log('Update available');", "console.warn('Update available');");
content = content.replace(".then((result) => {\n        if (result.response === 0) {\n          autoUpdater.quitAndInstall();\n        }\n      });", ".then((result) => {\n        if (result.response === 0) {\n          autoUpdater.quitAndInstall();\n        }\n      }).catch((err) => { console.error(err); });");
fs.writeFileSync('apps/frontend/electron/updater.ts', content, 'utf-8');
