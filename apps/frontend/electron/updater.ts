import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import type { BrowserWindow } from 'electron';

export function setupUpdater(_win: BrowserWindow | null): void {
  // Configure logging
  autoUpdater.logger = console;

  // Check for updates every hour
  void autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('error', (error) => {
    console.error('Update error:', error);
  });

  autoUpdater.on('update-available', () => {
    console.warn('Update available');
  });

  autoUpdater.on('update-downloaded', (info) => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Nova versão disponível!',
        message: `A versão ${info.version} foi baixada e está pronta para ser instalada. Deseja reiniciar agora para atualizar?`,
        buttons: ['Sim, reiniciar agora', 'Lembrar mais tarde'],
        defaultId: 0,
        cancelId: 1,
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
