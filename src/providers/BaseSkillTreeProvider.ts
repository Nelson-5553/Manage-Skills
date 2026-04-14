import * as vscode from 'vscode';
import { Technology } from '../models/Technology';

/**
 * Provider base para los árboles de tecnologías
 */
export abstract class BaseSkillTreeProvider implements vscode.TreeDataProvider<TechnologyTreeItem> {
	protected _onDidChangeTreeData: vscode.EventEmitter<TechnologyTreeItem | undefined | null | void> = 
		new vscode.EventEmitter<TechnologyTreeItem | undefined | null | void>();
	
	readonly onDidChangeTreeData: vscode.Event<TechnologyTreeItem | undefined | null | void> = 
		this._onDidChangeTreeData.event;

	constructor(protected technologies: Technology[]) {}

	getTreeItem(element: TechnologyTreeItem): vscode.TreeItem {
		return element;
	}

	abstract getChildren(element?: TechnologyTreeItem): Thenable<TechnologyTreeItem[]>;

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	updateTechnologies(technologies: Technology[]): void {
		this.technologies = technologies;
		this.refresh();
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
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
	) {
		super(technology.name, collapsibleState);
		this.description = `${technology.skills.length} skills`;
		this.tooltip = this.buildTooltip();
		this.contextValue = technology.installed ? 'installed-technology' : 'available-technology';
		this.iconPath = '/resources/icons/nodejs.svg';
		
	}

	private buildTooltip(): string {
		let tooltip = `${this.technology.name}\n`;
		tooltip += `ID: ${this.technology.id}\n`;
		tooltip += `Estado: ${this.technology.installed ? 'Instalado' : 'Disponible'}\n`;
		
		if (this.technology.detectedAt) {
			tooltip += `Detectado: ${this.technology.detectedAt.toLocaleDateString()}\n`;
		}
		
		tooltip += `Skills: ${this.technology.skills.length}`;
		
		return tooltip;
	}
}
