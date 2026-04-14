import * as vscode from 'vscode';
import { SkillsService } from './services/SkillsService';
import { AvailableSkillsProvider } from './providers/AvailableSkillsProvider';
import { InstalledSkillsProvider } from './providers/InstalledSkillsProvider';

/**
 * Contexto global de la extensión
 */
let skillsService: SkillsService;
let availableSkillsProvider: AvailableSkillsProvider;
let installedSkillsProvider: InstalledSkillsProvider;

/**
 * Esta función se ejecuta cuando la extensión se activa
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Extensión "manage-skills" activada');

	// Inicializar el servicio de skills
	skillsService = new SkillsService();

	// Inicializar los providers
	availableSkillsProvider = new AvailableSkillsProvider(skillsService.getAvailableTechnologies());
	installedSkillsProvider = new InstalledSkillsProvider(skillsService.getInstalledTechnologies());

	// Registrar los providers en VS Code
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('skillsView', availableSkillsProvider)
	);
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('installedSkillsView', installedSkillsProvider)
	);

	// Escuchar cambios en las tecnologías
	context.subscriptions.push(
		skillsService.onTechnologiesChanged((technologies) => {
			availableSkillsProvider.updateTechnologies(technologies.filter(t => !t.installed));
			installedSkillsProvider.updateTechnologies(technologies.filter(t => t.installed));
		})
	);

	// Detectar tecnologías en el workspace
	detectWorkspaceTechnologies();

	// Registrar comandos
	registerCommands(context);
}

/**
 * Detecta tecnologías en los workspaces abiertos
 */
function detectWorkspaceTechnologies(): void {
	if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
		const workspaceFolder = vscode.workspace.workspaceFolders[0];
		skillsService.detectTechnologies(workspaceFolder.uri.fsPath);
	}
}

/**
 * Registra todos los comandos de la extensión
 */
function registerCommands(context: vscode.ExtensionContext): void {
	// Comando: Hello World
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.helloWorld', () => {
			vscode.window.showInformationMessage('Hello World desde manage-skills!');
		})
	);

	// Comando: Marcar tecnología como instalada
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.markTechnologyInstalled', (technologyId: string) => {
			skillsService.markTechnologyInstalled(technologyId);
			vscode.window.showInformationMessage(`Tecnología ${technologyId} marcada como instalada`);
		})
	);

	// Comando: Marcar tecnología como no instalada
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.markTechnologyNotInstalled', (technologyId: string) => {
			skillsService.markTechnologyNotInstalled(technologyId);
			vscode.window.showInformationMessage(`Tecnología ${technologyId} marcada como no instalada`);
		})
	);

	// Comando: Redetectar tecnologías
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.redetectTechnologies', () => {
			detectWorkspaceTechnologies();
			vscode.window.showInformationMessage('Tecnologías redetectadas');
		})
	);

	// Comando: Copiar skill path al clipboard
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.copySkillPath', async (skillPath: string) => {
			await vscode.env.clipboard.writeText(skillPath);
			vscode.window.showInformationMessage(`✓ Skill copiado: ${skillPath}`);
		})
	);
}

/**
 * Esta función se ejecuta cuando la extensión se desactiva
 */
export function deactivate(): void {
	skillsService?.dispose();
	availableSkillsProvider?.dispose();
	installedSkillsProvider?.dispose();
}
