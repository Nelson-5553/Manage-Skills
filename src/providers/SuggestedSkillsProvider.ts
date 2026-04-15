import * as vscode from 'vscode';
import { BaseSkillTreeProvider, TechnologyTreeItem, SkillItemTreeItem, TreeElement, HeaderTreeItem } from './BaseSkillTreeProvider';
import { Technology } from '../models/Technology';
import { DetectionService } from '../services/DetectionService';

/**
 * Elemento de cabecera para el árbol de skills sugeridos
 */
class SuggestedSkillsHeaderItem extends vscode.TreeItem implements HeaderTreeItem {
	public buttons?: any[];

	constructor(suggestedCount: number) {
		super('Suggested Skills', vscode.TreeItemCollapsibleState.Expanded);
		this.description = `${suggestedCount} tecnología(s) detectada(s)`;
		this.contextValue = 'suggested-skills-header';

		// Agregar inline button a la cabecera
		this.buttons = [
			{
				iconPath: new vscode.ThemeIcon('arrow-down'),
				tooltip: 'Instalar todos los skills sugeridos',
				command: 'manage-skills.installAllSuggestedSkills',
				arguments: []
			}
		];
	}
}

/**
 * Provider para mostrar las tecnologías sugeridas detectadas en el workspace
 * con sus skills expandibles
 */
export class SuggestedSkillsProvider extends BaseSkillTreeProvider {
	private workspacePath: string = '';
	private detectedTechnologies: Technology[] = [];

	constructor(technologies: Technology[],  extensionUri: vscode.Uri) {
		super(technologies, extensionUri);
		
	}

	/**
	 * Actualiza la ruta del workspace y detecta las tecnologías
	 */
	setWorkspacePath(workspacePath: string): void {
		this.workspacePath = workspacePath;
		this.detectTechnologies();
	}

	/**
	 * Detecta las tecnologías en el workspace usando DetectionService
	 */
	private detectTechnologies(): void {
		if (!this.workspacePath) {
			this.detectedTechnologies = [];
			this.refresh();
			return;
		}

		const detected = DetectionService.detectTechnologies(this.workspacePath);
		
		// Enriquecemos los datos detectados con la información de skills
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

        // Si el elemento es la cabecera, retornar las tecnologías detectadas
        if (element instanceof SuggestedSkillsHeaderItem) {
            return Promise.resolve(
                this.detectedTechnologies.map(tech => 
                    new TechnologyTreeItem(tech, this.extensionUri) as unknown as TreeElement
                )
            );
        }

		// Si el elemento es una tecnología, retornamos sus skills
		if (element instanceof TechnologyTreeItem) {
			const skillItems = element.technology.skills.map(
				skill => new SkillItemTreeItem(skill, element.technology.id) as unknown as TreeElement
			);
			return Promise.resolve(skillItems);
		}

		// Si es un skill, no tiene hijos
		return Promise.resolve([]);
	}

	/**
	 * Obtiene el número de tecnologías detectadas/sugeridas
	 */
	getSuggestedCount(): number {
		return this.detectedTechnologies.length;
	}

	/**
	 * Obtiene las tecnologías detectadas
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
