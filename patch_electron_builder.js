import fs from 'fs';

const filepath = 'apps/frontend/electron-builder.json';
let obj = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

if (obj.mac && obj.mac.notarize) {
  obj.mac.notarize = false; // "mac.notarize should be a boolean" per error
}
if (obj.win && obj.win.signingHashAlgorithms) {
  delete obj.win.signingHashAlgorithms;
}

fs.writeFileSync(filepath, JSON.stringify(obj, null, 4), 'utf-8');
