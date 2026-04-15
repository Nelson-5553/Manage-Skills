import * as vscode from 'vscode';
import { BaseSkillTreeProvider, TechnologyTreeItem, SkillItemTreeItem, TreeElement } from './BaseSkillTreeProvider';
import { Technology } from '../models/Technology';

/**
 * Provider para mostrar las tecnologías disponibles para instalar
 * con sus skills expandibles
 */
export class AvailableSkillsProvider extends BaseSkillTreeProvider {
	getChildren(element?: TreeElement): Thenable<TreeElement[]> {
		// Si no hay elemento, retornamos las tecnologías raíz (disponibles)
		if (!element) {
			const availableTechs = this.technologies.filter(tech => !tech.installed);
			return Promise.resolve(
				availableTechs.map(tech => new TechnologyTreeItem(tech, this.extensionUri))
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
	 * Busca tecnologías disponibles
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
			.map(tech => new TechnologyTreeItem(tech, this.extensionUri));
	}

	/**
	 * Obtiene el número de tecnologías disponibles
	 */
	getAvailableCount(): number {
		return this.technologies.filter(tech => !tech.installed).length;
	}
}
