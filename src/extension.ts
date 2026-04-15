import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { SkillsService, BuildSkillPath } from './services/SkillsService';
import { DetectAgent } from './services/DetectionService';
import { AvailableSkillsProvider } from './providers/AvailableSkillsProvider';
import { InstalledSkillsProvider } from './providers/InstalledSkillsProvider';
import { SuggestedSkillsProvider } from './providers/SuggestedSkillsProvider';

/**
 * Contexto global de la extensión
 */
let skillsService: SkillsService;
let availableSkillsProvider: AvailableSkillsProvider;
let installedSkillsProvider: InstalledSkillsProvider;
let suggestedSkillsProvider: SuggestedSkillsProvider;

/**
 * Esta función se ejecuta cuando la extensión se activa
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Extensión "manage-skills" activada');

	// Inicializar el servicio de skills
	skillsService = new SkillsService();

	// Inicializar los providers
	availableSkillsProvider = new AvailableSkillsProvider(skillsService.getAvailableTechnologies(), context.extensionUri);
	// installedSkillsProvider = new InstalledSkillsProvider(skillsService.getInstalledTechnologies(), context.extensionUri);
	suggestedSkillsProvider = new SuggestedSkillsProvider(skillsService.getAvailableTechnologies(), context.extensionUri);

	// Registrar los providers en VS Code
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('skillsView', availableSkillsProvider)
	);
	// context.subscriptions.push(
	// 	vscode.window.registerTreeDataProvider('installedSkillsView', installedSkillsProvider)
	// );
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('suggestedSkillsView', suggestedSkillsProvider)
	);

	// Escuchar cambios en las tecnologías
	context.subscriptions.push(
		skillsService.onTechnologiesChanged((technologies) => {
			availableSkillsProvider.updateTechnologies(technologies.filter(t => !t.installed));
			// installedSkillsProvider.updateTechnologies(technologies.filter(t => t.installed));
			suggestedSkillsProvider.updateTechnologies(technologies);
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
		const workspacePath = workspaceFolder.uri.fsPath;
		skillsService.detectTechnologies(workspacePath);
		suggestedSkillsProvider.setWorkspacePath(workspacePath);
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

	const execAsync = promisify(exec);

	context.subscriptions.push(
    vscode.commands.registerCommand('manage-skills.installSkill', async (skillName: string) => {
        const command = BuildSkillPath(
            skillName, 
            DetectAgent(skillsService.getCurrentProjectPath())
        );

        vscode.window.showInformationMessage(`Instalando skill ${skillName}...`);

        try {
            await execAsync(command, {
                cwd: skillsService.getCurrentProjectPath()
            });
            vscode.window.showInformationMessage(`Skill ${skillName} instalada correctamente`);
        } catch (error) {
            vscode.window.showErrorMessage(`Ha ocurrido un error instalando ${skillName}`);
            console.error(error); // visible en el Output de la extensión
        }
    })
);
}

/**
 * Esta función se ejecuta cuando la extensión se desactiva
 */
export function deactivate(): void {
	skillsService?.dispose();
	availableSkillsProvider?.dispose();
	// installedSkillsProvider?.dispose();
	suggestedSkillsProvider?.dispose();
}
