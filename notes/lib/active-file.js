const { app, ipcMain, dialog} = require('electron');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

class ActiveFile {
    constructor(browserWindow, file = null) {
        this.browserWindow = browserWindow;
        this.open(file);
    }

    get isEdited() {
        return this.content !== this.originalContent;
    }

    open(file) {
        let content = '';
        if (file) {
            content = fs.readFileSync(file).toString();
        }

        this.file = file;
        this.content = content;
        this.originalContent = content;
        this.browserWindow.webContents.send('update-content', this);
        this.updateWindowTitle();
    }

    updateContent(content) {
        this.content = content;
        this.browserWindow.webContents.send('update-content', this);
        this.updateWindowTitle();
    }

    updateWindowTitle() {
        let title = 'Firesale';

        if (this.file) {
            title = `${this.file} - ${title}`;
        }

        if (this.isEdited) {
            title = `${title} (Edited)`;
        }

        this.browserWindow.setTitle(title);
    }
}

module.exports = ActiveFile;