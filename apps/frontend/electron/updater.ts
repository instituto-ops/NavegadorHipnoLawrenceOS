import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

export function setupUpdater(): void {
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
    void dialog
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
      .catch((error) => {
        console.error('Dialog error:', error);
      });
  });
}
