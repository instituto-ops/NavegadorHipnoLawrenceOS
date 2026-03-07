import fs from 'fs';

let content;

// electron/main.ts
content = fs.readFileSync('apps/frontend/electron/main.ts', 'utf-8');
content = content.replace("win.loadURL(VITE_DEV_SERVER_URL);", "void win.loadURL(VITE_DEV_SERVER_URL);");
content = content.replace("win.loadFile(path.join(RENDERER_DIST, 'index.html'));", "void win.loadFile(path.join(RENDERER_DIST, 'index.html'));");
content = content.replace("app.whenReady().then(() => {\n  setupUpdater();\n  createWindow();\n});", "void app.whenReady().then(() => {\n  setupUpdater(win);\n  createWindow();\n});");
content = content.replace("win?.webContents.send('main-process-message', new Date().toLocaleString());", "void win?.webContents.send('main-process-message', new Date().toLocaleString());");
fs.writeFileSync('apps/frontend/electron/main.ts', content, 'utf-8');

// electron/updater.ts
content = fs.readFileSync('apps/frontend/electron/updater.ts', 'utf-8');
content = content.replace('import { autoUpdater } from \'electron-updater\';', 'import { autoUpdater } from \'electron-updater\';\nimport type { BrowserWindow } from \'electron\';');
content = content.replace("autoUpdater.checkForUpdatesAndNotify()", "void autoUpdater.checkForUpdatesAndNotify()");
content = content.replace("autoUpdater.downloadUpdate()", "void autoUpdater.downloadUpdate()");
content = content.replace("export function setupUpdater(win: BrowserWindow) {", "export function setupUpdater(win: BrowserWindow | null): void {");
fs.writeFileSync('apps/frontend/electron/updater.ts', content, 'utf-8');
