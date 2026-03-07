import re

# electron/updater.ts
with open("apps/frontend/electron/updater.ts", "r") as f:
    content = f.read()

content = content.replace("void void autoUpdater.checkForUpdatesAndNotify();", "void autoUpdater.checkForUpdatesAndNotify();")
content = content.replace("console.log('Update available');", "console.warn('Update available');")
content = content.replace("      .then((result) => {", "      .then((result) => {") # No op for search

# we need to await or void the dialog.showMessageBox promise
content = content.replace("""    dialog
      .showMessageBox({""", """    void dialog
      .showMessageBox({""")


with open("apps/frontend/electron/updater.ts", "w") as f:
    f.write(content)
