// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


const fileCommand = require('./commands/file-command').default;
const {templateAdd, templateEdit} = require('./commands/template-command');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "es-cli" is now active!');
	const { env, workspace } = vscode;
	// const rootPath = workspace.rootPath;
	// console.log(rootPath)
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('es-cli.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from es-cli!');
	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.commands.registerCommand(fileCommand.name, fileCommand.callback));
	context.subscriptions.push(vscode.commands.registerCommand(templateAdd.name, templateAdd.callback));
	context.subscriptions.push(vscode.commands.registerCommand(templateEdit.name, templateEdit.callback));
}

// this method is called when your extension is deactivated
export function deactivate() {}
