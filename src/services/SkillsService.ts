import * as vscode from 'vscode';
import { SKILLS_MAP } from '../config/skills-map';
import { Technology } from '../models/Technology';
import { DetectionService } from './DetectionService';
import { SkillCommandBuilder } from './SkillCommandBuilder';

/**
 * @deprecated Use SkillCommandBuilder.buildInstallCommand() instead
 * Maintained for backward compatibility
 */
export function BuildSkillPath(skillName: string, agent: string = "universal"): string {
	const builder = new SkillCommandBuilder();
	return builder.buildInstallCommand(skillName, agent);
}

export class SkillsService {
	private technologies: Map<string, Technology> = new Map();
	private onTechnologiesChangedEmitter = new vscode.EventEmitter<Technology[]>();
	private projectPath: string = '';

	public readonly onTechnologiesChanged = this.onTechnologiesChangedEmitter.event;

	constructor() {
		this.initializeTechnologies();
	}

	/**
	 * Initializes all technologies from the map
	 */
	private initializeTechnologies(): void {
		SKILLS_MAP.forEach(tech => {
			this.technologies.set(tech.id, {
				...tech,
				installed: false
			});
		});
	}

	/**
	 * Detects technologies in a project
	 * @throws Error if projectPath is invalid or empty
	 */
	detectTechnologies(projectPath: string): void {
		if (!projectPath || typeof projectPath !== 'string') {
			throw new Error('Invalid projectPath: must be a non-empty string');
		}

		this.projectPath = projectPath;
		const detectedTechs = DetectionService.detectTechnologies(projectPath);

		// Mark detected ones as installed
		this.technologies.forEach(tech => {
			tech.installed = detectedTechs.some(dt => dt.id === tech.id);
			if (tech.installed) {
				tech.detectedAt = new Date();
			}
		});

		this.notifyTechnologiesChanged();
	}

	/**
	 * Gets all technologies
	 */
	getAllTechnologies(): Technology[] {
		return Array.from(this.technologies.values());
	}

	/**
	 * Gets only installed technologies
	 */
	getInstalledTechnologies(): Technology[] {
		return this.getAllTechnologies().filter(tech => tech.installed);
	}

	/**
	 * Gets only available technologies (not installed)
	 */
	getAvailableTechnologies(): Technology[] {
		return this.getAllTechnologies().filter(tech => !tech.installed);
	}

	/**
	 * Gets a specific technology by its ID
	 * @throws Error if ID is invalid
	 */
	getTechnologyById(id: string): Technology | undefined {
		if (!id || typeof id !== 'string') {
			throw new Error('Invalid technology ID: must be a non-empty string');
		}

		return this.technologies.get(id);
	}

	/**
	 * Gets the skills of a technology
	 * @throws Error if ID is invalid
	 */
	getTechnologySkills(technologyId: string): string[] {
		if (!technologyId || typeof technologyId !== 'string') {
			throw new Error('Invalid technology ID: must be a non-empty string');
		}

		return this.technologies.get(technologyId)?.skills || [];
	}

	/**
	 * Marks a technology as installed
	 */
	markTechnologyInstalled(technologyId: string): boolean {
		const tech = this.technologies.get(technologyId);
		if (!tech) {
			return false;
		}

		tech.installed = true;
		tech.detectedAt = new Date();
		this.notifyTechnologiesChanged();
		return true;
	}

	/**
	 * Marks a technology as not installed
	 */
	markTechnologyNotInstalled(technologyId: string): boolean {
		const tech = this.technologies.get(technologyId);
		if (!tech) {
			return false;
		}

		tech.installed = false;
		tech.detectedAt = undefined;
		this.notifyTechnologiesChanged();
		return true;
	}

	/**
	 * Searches technologies by name
	 */
	searchTechnologies(query: string): Technology[] {
		const lowerQuery = query.toLowerCase();
		return this.getAllTechnologies().filter(tech =>
			tech.name.toLowerCase().includes(lowerQuery) ||
			tech.id.toLowerCase().includes(lowerQuery)
		);
	}

	/**
	 * Filters technologies that have associated skills
	 */
	getTechnologiesWithSkills(): Technology[] {
		return this.getAllTechnologies().filter(tech => tech.skills && tech.skills.length > 0);
	}

	/**
	 * Gets the current project path
	 */
	getCurrentProjectPath(): string {
		return this.projectPath;
	}

	/**
	 * Notifies changes in technologies
	 */
	private notifyTechnologiesChanged(): void {
		this.onTechnologiesChangedEmitter.fire(this.getAllTechnologies());
	}

	/**
	 * Cleans up service resources
	 */
	dispose(): void {
		this.onTechnologiesChangedEmitter.dispose();
	}

	
}
