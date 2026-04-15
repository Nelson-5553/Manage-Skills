import * as vscode from 'vscode';
import { SkillsService } from './services/SkillsService';
import { InstallSkillService } from './services/InstallSkillService';
import { AvailableSkillsProvider } from './providers/AvailableSkillsProvider';
import { InstalledSkillsProvider } from './providers/InstalledSkillsProvider';
import { SuggestedSkillsProvider } from './providers/SuggestedSkillsProvider';

/**
 * Contexto global de la extensión
 */
let skillsService: SkillsService;
let installSkillService: InstallSkillService;
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

	// Inicializar el servicio de instalación
	installSkillService = new InstallSkillService(skillsService);

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

	// Comando: Instalar un skill individual
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.installSkill', async (arg: any) => {
			// El argumento puede ser un string (skillName) o un SkillItemTreeItem (desde el menú contextual)
			let skillName: string;
			
			if (typeof arg === 'string') {
				// Caso: llamado desde el botón inline con arguments: [skillName]
				skillName = arg;
			} else if (arg && typeof arg === 'object' && arg.skillName) {
				// Caso: llamado desde el menú contextual, recibe el TreeItem
				skillName = arg.skillName;
			} else {
				vscode.window.showErrorMessage('No se pudo determinar el skill');
				return;
			}

			await installSkillService.installSkill(skillName);
		})
	);

	// Comando: Instalar todos los skills de una tecnología específica
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.installTechSkills', async (arg: any) => {
			// El argumento puede ser un string (ID) o un TechnologyTreeItem (desde el menú contextual)
			let technologyId: string;
			
			if (typeof arg === 'string') {
				// Caso: llamado desde el botón inline con arguments: [technology.id]
				technologyId = arg;
			} else if (arg && typeof arg === 'object' && arg.technology) {
				// Caso: llamado desde el menú contextual, recibe el TreeItem
				technologyId = arg.technology.id;
			} else {
				vscode.window.showErrorMessage('No se pudo determinar la tecnología');
				return;
			}

			const technology = skillsService.getTechnologyById(technologyId);
			if (!technology) {
				vscode.window.showErrorMessage(`Tecnología ${technologyId} no encontrada`);
				return;
			}

			const skills = technology.skills || [];
			if (skills.length === 0) {
				vscode.window.showWarningMessage(`No hay skills para la tecnología ${technology.name}`);
				return;
			}

			await installSkillService.installMultipleSkills(skills, {
				showProgress: true,
				stopOnError: false
			});
		})
	);

	// Comando: Instalar todos los skills sugeridos
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.installAllSuggestedSkills', async () => {
			const detectedTechnologies = suggestedSkillsProvider.getDetectedTechnologies();

			if (detectedTechnologies.length === 0) {
				vscode.window.showWarningMessage('No hay tecnologías detectadas para instalar skills');
				return;
			}

			// Recopilar todos los skills de las tecnologías detectadas
			const allSkills: string[] = [];
			detectedTechnologies.forEach(tech => {
				if (tech.skills && tech.skills.length > 0) {
					allSkills.push(...tech.skills);
				}
			});

			if (allSkills.length === 0) {
				vscode.window.showWarningMessage('No hay skills sugeridos para instalar');
				return;
			}

			await installSkillService.installAllSuggestedSkills(allSkills);
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
