import * as vscode from 'vscode';
import { Technology } from '../models/Technology';

/**
 * Tipo unión para representar cualquier elemento del árbol
 */
export type TreeElement = TechnologyTreeItem | SkillItemTreeItem | HeaderTreeItem;

/**
 * Interfaz para elementos de cabecera del árbol
 */
export interface HeaderTreeItem extends vscode.TreeItem {
	buttons?: { iconPath: vscode.ThemeIcon | vscode.Uri | { light: vscode.Uri; dark: vscode.Uri }; tooltip?: string | vscode.MarkdownString; command?: string | vscode.Command; arguments?: any[] }[];
}

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

	/**
	 * Ayudante para agregar botones inline a un TreeItem
	 */
	protected addInlineButton(
		item: vscode.TreeItem,
		iconPath: vscode.ThemeIcon | vscode.Uri,
		tooltip: string,
		command: string,
		args?: any[]
	): void {
		const buttons = (item as any).buttons || [];
		buttons.push({
			iconPath,
			tooltip,
			command,
			arguments: args || []
		});
		(item as any).buttons = buttons;
	}
}

/**
 * Elemento personalizado del árbol de tecnologías
 */
export class TechnologyTreeItem extends vscode.TreeItem {
	public buttons?: any[];

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
			const fallbackUriLight = vscode.Uri.joinPath(extensionUri, "resources/empty-icon-light.svg");
			const fallbackUriDark = vscode.Uri.joinPath(extensionUri, "resources/empty-icon-dark.svg");
			this.iconPath = { light: fallbackUriLight, dark: fallbackUriDark };
		}
		
		// Agregar inline buttons para la tecnología
		this.buttons = [
			{
				iconPath: new vscode.ThemeIcon('arrow-down'),
				tooltip: 'Instalar todos los skills de esta tecnología',
				command: 'manage-skills.installTechSkills',
				arguments: [technology.id]
			}
		];
	}

	private buildTooltip(): string {
		let tooltip = `${this.technology.name}\n`;
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
	}

	private buildTooltip(): string {
		return `Skill: ${this.skillName}\n\nClick para instalar el skill`;
	}
}
