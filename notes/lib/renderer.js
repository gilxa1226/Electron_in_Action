const $ = require('jquery');
const marked = require('marked');
const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');
const { showOpenFileDialog } = mainProcess;

const $markdownView = $('.raw-markdown');
const $htmlView = $('.rendered-html');

function renderMarkdownToHtml(markdown) {
	var html = marked(markdown, {sanitize: true});
	$htmlView.html(html);
}

$markdownView.on('keyup', function() {
	const content = $(this).val();
	mainProcess.activeFile.updateContent(content);
	renderMarkdownToHtml(content);
});

$('#open-file').on('click', function openFileOnClick() {
	showOpenFileDialog();
});

ipcRenderer.on('file-opened', function fileOpened(event, file, content) {
	$markdownView.text(content);
	renderMarkdownToHtml(content);
});

ipcRenderer.on('update-content', function updateContent(event, file) {
	$markdownView.val(file.content);
	renderMarkdownToHtml(file.content);
});