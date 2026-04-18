import * as vscode from 'vscode';
import { BaseSkillTreeProvider, TechnologyTreeItem, SkillItemTreeItem, TreeElement } from './BaseSkillTreeProvider';
import { Technology } from '../models/Technology';

/**
 * Shows available technologies with their skills
 */
export class AvailableSkillsProvider extends BaseSkillTreeProvider {
	getChildren(element?: TreeElement): Thenable<TreeElement[]> {
		// Returns root technologies if no element
		if (!element) {
			const availableTechs = this.technologies.filter(tech => !tech.installed);
			return Promise.resolve(
				availableTechs.map(tech => new TechnologyTreeItem(tech, this.extensionUri, vscode.TreeItemCollapsibleState.Collapsed))
			);
		}

		// Returns skills for technology
		if (element instanceof TechnologyTreeItem) {
			const skillItems = element.technology.skills.map(
				skill => new SkillItemTreeItem(skill, element.technology.id)
			);
			return Promise.resolve(skillItems);
		}

		// Skills have no children
		return Promise.resolve([]);
	}

	/**
	 * Searches available technologies
	 */
	searchTechnologies(query: string): TechnologyTreeItem[] {
		const lowerQuery = query.toLowerCase();
		return this.technologies
			.filter(tech => 
				!tech.installed && (
					tech.name.toLowerCase().includes(lowerQuery) ||
					tech.id.toLowerCase().includes(lowerQuery)
				)
			)
			.map(tech => new TechnologyTreeItem(tech, this.extensionUri, vscode.TreeItemCollapsibleState.Collapsed));
	}

	/**
	 * Gets count of available technologies
	 */
	getAvailableCount(): number {
		return this.technologies.filter(tech => !tech.installed).length;
	}
}
