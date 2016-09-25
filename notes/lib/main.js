const {app, BrowserWindow, dialog} = require('electron');

const fs = require('fs');

const ActiveFile = require('./active-file');

let mainWindow = null;
let activeFile = null;

app.on('ready', function() {
	mainWindow = new BrowserWindow();
	activeFile = new ActiveFile(mainWindow);

	mainWindow.loadURL('file://' + __dirname + '/index.html');

	mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});

const showOpenFileDialog = () => {
	const files = dialog.showOpenDialog({
		properties: ['openFile'],
		filters: [
			{name: 'Text Files', extensions: ['txt']},
			{name: 'Markdown Files', extensions: ['md', 'markdown']}
		]
	});

	if (files) { activeFile.open(files[0]); }
};

module.exports = {
	showOpenFileDialog,
	getActiveFile() { return activeFile; }
};