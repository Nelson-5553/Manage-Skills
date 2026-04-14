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

	constructor(protected technologies: Technology[]) {
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
 * Map de emojis para tecnologías (fallback cuando no hay URL de ícono)
 */
const TECHNOLOGY_EMOJI_MAP: Record<string, string> = {
	'react': '⚛️',
	'nextjs': '▲',
	'vue': '💚',
	'nuxt': '🟢',
	'pinia': '🍍',
	'svelte': '🔥',
	'angular': '🅰️',
	'astro': '🚀',
	'tailwind': '🌊',
	'shadcn': '🎨',
	'typescript': '🔷',
	'zod': '🛡️',
	'supabase': '🐘',
	'neon': '💜',
	'playwright': '🎭',
	'expo': '📱',
	'react-native': '⚛️',
	'dart': '🎯',
	'flutter': '🦋',
	'kotlin-multiplatform': '🎲',
	'android': '🤖',
	'remotion': '🎬',
	'react-router': '🛣️',
	'tanstack-start': '🏃',
	'chrome-extension': '🧩',
	'clerk': '🔐',
	'better-auth': '🔑',
	'turborepo': '⚡',
	'vite': '⚡',
	'azure': '☁️',
	'vercel-ai': '🤖',
	'elevenlabs': '🎤',
	'vercel-deploy': '▲',
	'cloudflare': '☁️',
	'cloudflare-durable-objects': '🏢',
	'cloudflare-agents': '🤖',
	'cloudflare-ai': '🤖',
	'terraform': '🏗️',
	'aws': '📦',
	'swiftui': '🍎',
	'oxlint': '🔍',
	'gsap': '🎪',
	'threejs': '🎮',
	'@react-three/fiber': '🎨',
	'bun': '🍔',
	'node': '💚',
	'express': '🚂',
	'go': '🐹',
	'deno': '🦕',
	'wordpress': '📝',
	'java': '☕',
	'springboot': '🌱',
	'prisma': '🔶',
	'stripe': '💳',
	'hono': '🔥',
	'vitest': '⚡',
	'drizzle': '🚀',
	'nestjs': '🦅',
	'tauri': '🔧',
	'electron': '🖥️',
	'rust': '🦀',
	'ruby': '💎',
	'rails': '🛤️',
	'redis-ruby': '💾',
	'postgres-ruby': '🐘',
	'python': '🐍',
	'sorbet': '💎',
	'activeadmin': '👑',
	'django': '🚀',
	'devise': '🔓',
	'fastapi': '⚡',
	'sidekiq': '⚙️',
	'rspec': '🧪',
	'rubocop': '👮',
	'php': '🐘',
	'laravel': '🎨',
	'flask': '🍶',
	'pydantic': '🎯',
	'sqlalchemy': '💾',
	'pytest': '🧪',
	'pandas': '🐼',
	'numpy': '🔢',
	'scikit-learn': '🤖',
	'celery': '⚙️',
	'requests': '📡',
};

/**
 * Elemento personalizado del árbol de tecnologías
 */
export class TechnologyTreeItem extends vscode.TreeItem {
	constructor(
		public readonly technology: Technology,
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
	) {
		if (technology.skills.length === 0) {
			collapsibleState = vscode.TreeItemCollapsibleState.None;
		}
		super(technology.name, collapsibleState);
		this.description = `${technology.skills.length} skills`;
		this.tooltip = this.buildTooltip();
		this.contextValue = technology.installed ? 'installed-technology' : 'available-technology';
		
		// Usar emoji como ícono basado en el ID de la tecnología
		const emoji = TECHNOLOGY_EMOJI_MAP[technology.id] || '📦';
		this.label = `${emoji} ${technology.name}`;
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
