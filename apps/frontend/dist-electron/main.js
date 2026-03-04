import { app as n, BrowserWindow as t } from "electron";
import e from "node:path";
import { fileURLToPath as c } from "node:url";
const s = e.dirname(c(import.meta.url));
process.env.APP_ROOT = e.join(s, "..");
const i = process.env.VITE_DEV_SERVER_URL, R = e.join(process.env.APP_ROOT, "dist-electron"), r = e.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = i ? e.join(process.env.APP_ROOT, "public") : r;
let o;
function a() {
  o = new t({
    width: 1200,
    height: 800,
    icon: e.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: e.join(s, "preload.mjs"),
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: !0,
      contextIsolation: !1
      // Set to false to allow nodeIntegration to work as expected
    }
  }), o.webContents.on("did-finish-load", () => {
    o?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i ? o.loadURL(i) : o.loadFile(e.join(r, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), o = null);
});
n.on("activate", () => {
  t.getAllWindows().length === 0 && a();
});
n.whenReady().then(a);
export {
  R as MAIN_DIST,
  r as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
