import * as vscode from 'vscode';
import { BaseSkillTreeProvider, TechnologyTreeItem, SkillItemTreeItem, TreeElement } from './BaseSkillTreeProvider';
import { Technology } from '../models/Technology';

/**
 * Provider para mostrar las tecnologías instaladas
 * con sus skills expandibles
 */
export class InstalledSkillsProvider extends BaseSkillTreeProvider {
	getChildren(element?: TreeElement): Thenable<TreeElement[]> {
		// Si no hay elemento, retornamos las tecnologías raíz (instaladas)
		if (!element) {
			const installedTechs = this.technologies.filter(tech => tech.installed);
			return Promise.resolve(
				installedTechs.map(tech => new TechnologyTreeItem(tech, this.extensionUri))
			);
		}

		// Si el elemento es una tecnología, retornamos sus skills
		if (element instanceof TechnologyTreeItem) {
			const skillItems = element.technology.skills.map(
				skill => new SkillItemTreeItem(skill, element.technology.id)
			);
			return Promise.resolve(skillItems);
		}

		// Si es un skill, no tiene hijos
		return Promise.resolve([]);
	}

	/**
	 * Busca tecnologías instaladas
	 */
	searchTechnologies(query: string): TechnologyTreeItem[] {
		const lowerQuery = query.toLowerCase();
		return this.technologies
			.filter(tech => 
				tech.installed && (
					tech.name.toLowerCase().includes(lowerQuery) ||
					tech.id.toLowerCase().includes(lowerQuery)
				)
			)
			.map(tech => new TechnologyTreeItem(tech, this.extensionUri));
	}

	/**
	 * Obtiene el número de tecnologías instaladas
	 */
	getInstalledCount(): number {
		return this.technologies.filter(tech => tech.installed).length;
	}
}
