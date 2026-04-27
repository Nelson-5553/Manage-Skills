import * as vscode from 'vscode';
import { BaseSkillTreeProvider, TechnologyTreeItem, SkillItemTreeItem, TreeElement, HeaderTreeItem } from './BaseSkillTreeProvider';
import { Technology } from '../models/Technology';
import { DetectionService } from '../services/DetectionService';
import { FRONTEND_SKILLS } from '../config/skills-map';

/**
 * Header for suggested skills
 */
class SuggestedSkillsHeaderItem extends vscode.TreeItem implements HeaderTreeItem {
	public buttons?: any[];

	constructor(suggestedCount: number) {
		super('Suggested Skills', vscode.TreeItemCollapsibleState.Expanded);
		this.description = `${suggestedCount} detected technology${suggestedCount !== 1 ? 'ies' : ''}`;
		this.contextValue = 'suggested-skills-header';

		// Add inline button
		this.buttons = [
			{
				iconPath: new vscode.ThemeIcon('arrow-down'),
				tooltip: 'Install all suggested skills',
				command: 'manage-skills.installAllSuggestedSkills',
				arguments: []
			}
		];
	}
}

/**
 * Header for frontend skills subsection
 */
class FrontendSkillsHeaderItem extends vscode.TreeItem implements HeaderTreeItem {
	public buttons?: any[];

	constructor(skillsCount: number) {
		super('Frontend Skills', vscode.TreeItemCollapsibleState.Expanded);
		this.description = `${skillsCount} skill${skillsCount !== 1 ? 's' : ''}`;
		this.contextValue = 'frontend-skills-header';

		// Add inline button
		this.buttons = [
			{
				iconPath: new vscode.ThemeIcon('arrow-down'),
				tooltip: 'Install all frontend skills',
				command: 'manage-skills.installFrontendSkills',
				arguments: []
			}
		];
	}
}

/**
 * Frontend skill item
 */
class FrontendSkillItemTreeItem extends vscode.TreeItem {
	public buttons?: any[];

	constructor(
		public readonly skillName: string
	) {
		super(skillName, vscode.TreeItemCollapsibleState.None);
		this.tooltip = this.buildTooltip();
		this.contextValue = 'frontend-skill-item';

		// Add inline button for installation
		this.buttons = [
			{
				iconPath: new vscode.ThemeIcon('arrow-down'),
				tooltip: 'Install this skill',
				command: 'manage-skills.installSkill',
				arguments: [skillName]
			}
		];
	}

	private buildTooltip(): string {
		return `Skill: ${this.skillName}\n\nClick to install skill`;
	}
}

/**
 * Shows suggested technologies detected in workspace
 */
export class SuggestedSkillsProvider extends BaseSkillTreeProvider {
	private workspacePath: string = '';
	private detectedTechnologies: Technology[] = [];
	private hasFrontendFiles: boolean = false;

	constructor(technologies: Technology[],  extensionUri: vscode.Uri) {
		super(technologies, extensionUri);
		
	}

	/**
	 * Sets workspace path and detects technologies
	 */
	setWorkspacePath(workspacePath: string): void {
		this.workspacePath = workspacePath;
		this.detectTechnologies();
	}

	/**
	 * Detects technologies in workspace
	 */
	private detectTechnologies(): void {
		if (!this.workspacePath) {
			this.detectedTechnologies = [];
			this.hasFrontendFiles = false;
			this.refresh();
			return;
		}

		const detected = DetectionService.detectTechnologies(this.workspacePath);
		
		// Enriches detected technologies with skill data
		this.detectedTechnologies = detected
			.map(detectedTech => {
				const fullTech = this.technologies.find(t => t.id === detectedTech.id);
				if (fullTech) {
					return fullTech;
				}
				// Si no tenemos la tech completa en nuestro arreglo, la completamos
				return {
					...detectedTech,
					installed: false,
					detectedAt: new Date()
				};
			})
			.filter(tech => tech.skills && tech.skills.length > 0);

		// Detect if there are frontend files
		this.hasFrontendFiles = DetectionService.detectFrontendFiles(this.workspacePath);

		this.refresh();
	}

	getChildren(element?: TreeElement): Thenable<TreeElement[]> {
        if (!element) {
            // Mostrar la cabecera como primer elemento
            const headerItem = new SuggestedSkillsHeaderItem(this.detectedTechnologies.length) as unknown as TreeElement;
            return Promise.resolve([headerItem]);
        }

        // Returns detected technologies and frontend skills section
        if (element instanceof SuggestedSkillsHeaderItem) {
            const children: TreeElement[] = this.detectedTechnologies.map(tech => 
                new TechnologyTreeItem(tech, this.extensionUri) as unknown as TreeElement
            );
            
            // Add frontend skills section only if frontend files are detected
            if (this.hasFrontendFiles) {
                children.push(
                    new FrontendSkillsHeaderItem(FRONTEND_SKILLS.length) as unknown as TreeElement
                );
            }
            
            return Promise.resolve(children);
        }

		// Returns frontend skills for the frontend skills header
		if (element instanceof FrontendSkillsHeaderItem) {
			const skillItems = FRONTEND_SKILLS.map(
				skill => new FrontendSkillItemTreeItem(skill) as unknown as TreeElement
			);
			return Promise.resolve(skillItems);
		}

		// Returns skills for technology
		if (element instanceof TechnologyTreeItem) {
			const skillItems = element.technology.skills.map(
				skill => new SkillItemTreeItem(skill, element.technology.id) as unknown as TreeElement
			);
			return Promise.resolve(skillItems);
		}

		// Skills have no children
		return Promise.resolve([]);
	}

	/**
	 * Gets count of suggested technologies
	 */
	getSuggestedCount(): number {
		return this.detectedTechnologies.length;
	}

	/**
	 * Gets detected technologies
	 */
	getDetectedTechnologies(): Technology[] {
		return this.detectedTechnologies;
	}

	/**
	 * Gets whether frontend files were detected
	 */
	hasFrontendFilesDetected(): boolean {
		return this.hasFrontendFiles;
	}

	/**
	 * Redetecta las tecnologías en el workspace actual
	 */
	redetect(): void {
		this.detectTechnologies();
	}
}
