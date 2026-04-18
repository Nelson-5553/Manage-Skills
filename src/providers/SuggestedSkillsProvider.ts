import * as vscode from 'vscode';
import { BaseSkillTreeProvider, TechnologyTreeItem, SkillItemTreeItem, TreeElement, HeaderTreeItem } from './BaseSkillTreeProvider';
import { Technology } from '../models/Technology';
import { DetectionService } from '../services/DetectionService';

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
 * Shows suggested technologies detected in workspace
 */
export class SuggestedSkillsProvider extends BaseSkillTreeProvider {
	private workspacePath: string = '';
	private detectedTechnologies: Technology[] = [];

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

		this.refresh();
	}

	getChildren(element?: TreeElement): Thenable<TreeElement[]> {
        if (!element) {
            // Mostrar la cabecera como primer elemento
            const headerItem = new SuggestedSkillsHeaderItem(this.detectedTechnologies.length) as unknown as TreeElement;
            return Promise.resolve([headerItem]);
        }

        // Returns detected technologies
        if (element instanceof SuggestedSkillsHeaderItem) {
            return Promise.resolve(
                this.detectedTechnologies.map(tech => 
                    new TechnologyTreeItem(tech, this.extensionUri) as unknown as TreeElement
                )
            );
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
	 * Redetecta las tecnologías en el workspace actual
	 */
	redetect(): void {
		this.detectTechnologies();
	}
}
