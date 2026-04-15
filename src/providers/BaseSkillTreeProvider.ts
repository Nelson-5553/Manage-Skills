import * as vscode from 'vscode';
import { Technology } from '../models/Technology';

/**
 * Tipo unión para representar cualquier elemento del árbol
 */
export type TreeElement = TechnologyTreeItem | SkillItemTreeItem;

/**
 * Provider base para los árboles de tecnologías
 */
export abstract class BaseSkillTreeProvider implements vscode.TreeDataProvider<TreeElement> {
	protected _onDidChangeTreeData: vscode.EventEmitter<TreeElement | undefined | null | void> =
		new vscode.EventEmitter<TreeElement | undefined | null | void>();

	readonly onDidChangeTreeData: vscode.Event<TreeElement | undefined | null | void> =
		this._onDidChangeTreeData.event;

	constructor(protected technologies: Technology[], protected extensionUri: vscode.Uri) {
		this.technologies = this.filterTechnologiesWithSkills(technologies);
	}

	getTreeItem(element: TreeElement): vscode.TreeItem {
		return element;
	}

	abstract getChildren(element?: TreeElement): Thenable<TreeElement[]>;

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	updateTechnologies(technologies: Technology[]): void {
		this.technologies = this.filterTechnologiesWithSkills(technologies);
		this.refresh();
	}

	private filterTechnologiesWithSkills(technologies: Technology[]): Technology[] {
		return technologies.filter(technology => technology.skills.length > 0);
	}

	dispose(): void {
		this._onDidChangeTreeData.dispose();
	}
}

/**
 * Elemento personalizado del árbol de tecnologías
 */
export class TechnologyTreeItem extends vscode.TreeItem {
	constructor(
		public readonly technology: Technology,
		extensionUri: vscode.Uri,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		if (technology.skills.length === 0) {
			collapsibleState = vscode.TreeItemCollapsibleState.None;
		}
		super(technology.name, collapsibleState);
		this.description = `${technology.skills.length} skills`;
		this.tooltip = this.buildTooltip();
		this.contextValue = technology.installed ? 'installed-technology' : 'available-technology';

		this.label = `${technology.name}`;

		if (technology.icon) {
			const iconUri = vscode.Uri.joinPath(extensionUri, technology.icon);
			this.iconPath = { light: iconUri, dark: iconUri };
		} else {
			const fallbackUri = vscode.Uri.joinPath(extensionUri, "resources/icons/nodejs.svg");
			this.iconPath = { light: fallbackUri, dark: fallbackUri };
		} 
	}


	private buildTooltip(): string {
		let tooltip = `${this.technology.name}\n`;
		tooltip += `Estado: ${this.technology.installed ? 'Instalado' : 'Disponible'}\n`;
		if (this.technology.detectedAt) {
			tooltip += `Detectado: ${this.technology.detectedAt.toLocaleDateString()}\n`;
		}
		return tooltip;
	}
}

/**
 * Elemento del árbol que representa un skill individual
 */
export class SkillItemTreeItem extends vscode.TreeItem {
	constructor(
		public readonly skillName: string,
		public readonly technologyId: string
	) {
		super(skillName, vscode.TreeItemCollapsibleState.None);
		this.tooltip = this.buildTooltip();
		this.contextValue = 'skill-item';

		// Comando para copiar el skill al clipboard
		this.command = {
			title: 'Copy Skill Path',
			command: 'manage-skills.copySkillPath',
			arguments: [skillName]
		};
	}

	private buildTooltip(): string {
		return `Skill: ${this.skillName}\n\nClick para copiar la ruta del skill`;
	}
}
