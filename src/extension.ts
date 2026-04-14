// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

class SkillTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	constructor(private readonly items: vscode.TreeItem[]) {}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(): Thenable<vscode.TreeItem[]> {
		return Promise.resolve(this.items);
	}
}

function createSkillItem(
	context: vscode.ExtensionContext,
	label: string,
	iconFileName: string
): vscode.TreeItem {
	const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
	item.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'icons', iconFileName));
	return item;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "manage-skills" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('manage-skills.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from manage-skills!');
	});

	const availableSkillsProvider = new SkillTreeProvider([
		createSkillItem(context, 'TypeScript', 'typescript.svg'),
		createSkillItem(context, 'React', 'react.svg'),
		createSkillItem(context, 'Node.js', 'nodejs.svg')
	]);

	const installedSkillsProvider = new SkillTreeProvider([
		createSkillItem(context, 'TypeScript - installed', 'typescript.svg'),
		createSkillItem(context, 'Node.js - installed', 'nodejs.svg')
	]);

	context.subscriptions.push(vscode.window.registerTreeDataProvider('skillsView', availableSkillsProvider));
	context.subscriptions.push(vscode.window.registerTreeDataProvider('installedSkillsView', installedSkillsProvider));

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
