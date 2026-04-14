import * as vscode from 'vscode';
import { BaseSkillTreeProvider, TechnologyTreeItem } from './BaseSkillTreeProvider';
import { Technology } from '../models/Technology';

/**
 * Provider para mostrar las tecnologías instaladas
 */
export class InstalledSkillsProvider extends BaseSkillTreeProvider {
	getChildren(element?: TechnologyTreeItem): Thenable<TechnologyTreeItem[]> {
		// Si no hay elemento, retornamos las tecnologías raíz (instaladas)
		if (!element) {
			const installedTechs = this.technologies.filter(tech => tech.installed);
			return Promise.resolve(
				installedTechs.map(tech => new TechnologyTreeItem(tech))
			);
		}

		// Las tecnologías no tienen hijos en este contexto
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
			.map(tech => new TechnologyTreeItem(tech));
	}

	/**
	 * Obtiene el número de tecnologías instaladas
	 */
	getInstalledCount(): number {
		return this.technologies.filter(tech => tech.installed).length;
	}
}
