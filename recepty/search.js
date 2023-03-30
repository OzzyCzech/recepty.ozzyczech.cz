import pages from './pages.json' assert {type: 'json'};
import 'https://esm.sh/cmd-dialog'; // https://esm.run/cmd-dialog

const dialog = document.querySelector('cmd-dialog');
dialog.actions = pages;

const button = document.querySelector('button');
button.addEventListener('click', () => {
	dialog.open();
});