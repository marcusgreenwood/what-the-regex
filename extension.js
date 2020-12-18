const vscode = require('vscode');
const { Client } = require('@automationcloud/client');

const API_KEY = 'c520a5c2884335d3eb17cb49a10d25e914eeb9c5c99ad7e9'; // public API key for WTR
const SERVICE_ID = '2df984fe-ed9b-488a-b2a9-738ff9a8eeea';

function activate(context) {
	let disposable = vscode.commands.registerCommand('what-the-regex.search', async function () {
		const inputBox = vscode.window.showInputBox();
		inputBox.then(async (str) => {
			if (!vscode.window.activeTextEditor) {
				return;
			}

			vscode.window.setStatusBarMessage(`Searching StackOverflow for regex solution to "${str}". please wait...`, 15000);
			
			const client = new Client({ serviceId: SERVICE_ID, auth: API_KEY });
			const input = { search: str };
			const job = await client.createJob({ input });

			const [output] = await job.waitForOutputs('regex');
			
			let edit = new vscode.WorkspaceEdit();
			edit.insert(vscode.window.activeTextEditor.document.uri, vscode.window.activeTextEditor.selection.active, `${output.regexes[0]}; // ${output.url}`);
			await vscode.workspace.applyEdit(edit).then();

			vscode.window.setStatusBarMessage(``);
		});
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
