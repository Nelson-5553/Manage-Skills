import * as vscode from 'vscode';
import { BaseSkillTreeProvider, TechnologyTreeItem } from './BaseSkillTreeProvider';
import { Technology } from '../models/Technology';

/**
 * Provider para mostrar las tecnologías disponibles para instalar
 */
export class AvailableSkillsProvider extends BaseSkillTreeProvider {
	getChildren(element?: TechnologyTreeItem): Thenable<TechnologyTreeItem[]> {
		// Si no hay elemento, retornamos las tecnologías raíz (disponibles)
		if (!element) {
			const availableTechs = this.technologies.filter(tech => !tech.installed);
			return Promise.resolve(
				availableTechs.map(tech => new TechnologyTreeItem(tech))
			);
		}

		// Las tecnologías no tienen hijos en este contexto
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
			.map(tech => new TechnologyTreeItem(tech));
	}

	/**
	 * Obtiene el número de tecnologías disponibles
	 */
	getAvailableCount(): number {
		return this.technologies.filter(tech => !tech.installed).length;
	}
}
