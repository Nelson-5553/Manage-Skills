import * as vscode from 'vscode';
import { SkillsService } from './services/SkillsService';
import { InstallSkillService } from './services/InstallSkillService';
import { AvailableSkillsProvider } from './providers/AvailableSkillsProvider';
import { SuggestedSkillsProvider } from './providers/SuggestedSkillsProvider';
import { FRONTEND_SKILLS } from './config/skills-map';

/**
 * Global extension context
 */
let skillsService: SkillsService;
let installSkillService: InstallSkillService;
let availableSkillsProvider: AvailableSkillsProvider;
let suggestedSkillsProvider: SuggestedSkillsProvider;

/**
 * Activates the extension
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "manage-skills" activated');

	// Initialize services
	skillsService = new SkillsService();
	installSkillService = new InstallSkillService(skillsService);

	// Initialize providers
	availableSkillsProvider = new AvailableSkillsProvider(skillsService.getAvailableTechnologies(), context.extensionUri);
	suggestedSkillsProvider = new SuggestedSkillsProvider(skillsService.getAvailableTechnologies(), context.extensionUri);

	// Register providers
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('skillsView', availableSkillsProvider)
	);
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('suggestedSkillsView', suggestedSkillsProvider)
	);

	// Listen for technology changes
	context.subscriptions.push(
		skillsService.onTechnologiesChanged((technologies) => {
			availableSkillsProvider.updateTechnologies(technologies.filter(t => !t.installed));
			suggestedSkillsProvider.updateTechnologies(technologies);
		})
	);

	// Detect workspace technologies
	detectWorkspaceTechnologies();

	registerCommands(context);
}

/**
 * Detects technologies in workspace
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
 * Registers extension commands
 */
function registerCommands(context: vscode.ExtensionContext): void {
	context.subscriptions.push(
	vscode.commands.registerCommand('manage-skills.openDocs', async (arg: any) => {
	let skillName: string;
	
	if (typeof arg === 'string') {
		skillName = arg;
	} else if (arg && typeof arg === 'object' && arg.skillName) {
		skillName = arg.skillName;
	} else {
		vscode.window.showErrorMessage('Could not determine skill');
		return;
	}
	
	const url = vscode.Uri.parse(`https://skills.sh/${skillName}`);
	vscode.env.openExternal(url);
})
);

	// Redetect technologies
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.redetectTechnologies', () => {
			detectWorkspaceTechnologies();
			vscode.window.showInformationMessage('Technologies redetected');
		})
	);

	// Install individual skill
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.installSkill', async (arg: any) => {
			let skillName: string;
			
			if (typeof arg === 'string') {
				skillName = arg;
			} else if (arg && typeof arg === 'object' && arg.skillName) {
				skillName = arg.skillName;
			} else {
				vscode.window.showErrorMessage('Could not determine skill');
				return;
			}

			await installSkillService.installSkill(skillName);
		})
	);

	// Install all skills for a technology
context.subscriptions.push(
    vscode.commands.registerCommand('manage-skills.installTechSkills', async (arg: any) => {
        let technologyId: string;

        if (typeof arg === 'string') {
            technologyId = arg;
        } else if (arg && typeof arg === 'object' && arg.technology) {
            technologyId = arg.technology.id;
        } else {
            // Command palette fallback → QuickPick
            const technologies = skillsService.getAllTechnologies();

            if (!technologies || technologies.length === 0) {
                vscode.window.showWarningMessage('No technologies available');
                return;
            }

            const picked = await vscode.window.showQuickPick(
                technologies.map(tech => ({
                    label: tech.name,
                    description: `${tech.skills?.length ?? 0} skills`,
                    id: tech.id
                })),
                { placeHolder: 'Select a technology to install its skills' }
            );

            if (!picked) return;

            technologyId = picked.id;
        }

        const technology = skillsService.getTechnologyById(technologyId);
        if (!technology) {
            vscode.window.showErrorMessage(`Technology ${technologyId} not found`);
            return;
        }

        const skills = technology.skills || [];
        if (skills.length === 0) {
            vscode.window.showWarningMessage(`No skills available for ${technology.name}`);
            return;
        }

        await installSkillService.installMultipleSkills(skills, {
            showProgress: true,
            stopOnError: false
        });
    })
);
	// Install all suggested skills
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.installAllSuggestedSkills', async () => {
			const detectedTechnologies = suggestedSkillsProvider.getDetectedTechnologies();

			if (detectedTechnologies.length === 0) {
				vscode.window.showWarningMessage('No technologies detected');
				return;
			}

			// Collect all skills from detected technologies
			const allSkills: string[] = [];
			detectedTechnologies.forEach(tech => {
				if (tech.skills && tech.skills.length > 0) {
					allSkills.push(...tech.skills);
				}
			});

			// Add frontend skills
			allSkills.push(...FRONTEND_SKILLS);

			if (allSkills.length === 0) {
				vscode.window.showWarningMessage('No suggested skills available');
				return;
			}

			await installSkillService.installAllSuggestedSkills(allSkills);
		})
	);

	// Install frontend skills only
	context.subscriptions.push(
		vscode.commands.registerCommand('manage-skills.installFrontendSkills', async () => {
			if (FRONTEND_SKILLS.length === 0) {
				vscode.window.showWarningMessage('No frontend skills available');
				return;
			}

			await installSkillService.installAllSuggestedSkills(FRONTEND_SKILLS);
		})
	);
}

/**
 * Deactivates the extension
 */
export function deactivate(): void {
	skillsService?.dispose();
	availableSkillsProvider?.dispose();
	suggestedSkillsProvider?.dispose();
}
