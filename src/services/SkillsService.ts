import * as vscode from 'vscode';
import { SKILLS_MAP } from '../config/skills-map';
import { Technology } from '../models/Technology';
import { DetectionService } from './DetectionService';
import { SkillCommandBuilder } from './SkillCommandBuilder';

/**
 * @deprecated Usa SkillCommandBuilder.buildInstallCommand() en su lugar
 * Mantenido para compatibilidad con código existente
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
	 * Inicializa todas las tecnologías del mapa
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
	 * Detecta tecnologías en un proyecto
	 * @throws Error si projectPath es inválido o vacío
	 */
	detectTechnologies(projectPath: string): void {
		if (!projectPath || typeof projectPath !== 'string') {
			throw new Error('Invalid projectPath: must be a non-empty string');
		}

		this.projectPath = projectPath;
		const detectedTechs = DetectionService.detectTechnologies(projectPath);

		// Marcar detectadas como instaladas
		this.technologies.forEach(tech => {
			tech.installed = detectedTechs.some(dt => dt.id === tech.id);
			if (tech.installed) {
				tech.detectedAt = new Date();
			}
		});

		this.notifyTechnologiesChanged();
	}

	/**
	 * Obtiene todas las tecnologías
	 */
	getAllTechnologies(): Technology[] {
		return Array.from(this.technologies.values());
	}

	/**
	 * Obtiene solo las tecnologías instaladas
	 */
	getInstalledTechnologies(): Technology[] {
		return this.getAllTechnologies().filter(tech => tech.installed);
	}

	/**
	 * Obtiene solo las tecnologías disponibles (no instaladas)
	 */
	getAvailableTechnologies(): Technology[] {
		return this.getAllTechnologies().filter(tech => !tech.installed);
	}

	/**
	 * Obtiene una tecnología específica por su ID
	 * @throws Error si ID es inválido
	 */
	getTechnologyById(id: string): Technology | undefined {
		if (!id || typeof id !== 'string') {
			throw new Error('Invalid technology ID: must be a non-empty string');
		}

		return this.technologies.get(id);
	}

	/**
	 * Obtiene los skills de una tecnología
	 * @throws Error si ID es inválido
	 */
	getTechnologySkills(technologyId: string): string[] {
		if (!technologyId || typeof technologyId !== 'string') {
			throw new Error('Invalid technology ID: must be a non-empty string');
		}

		return this.technologies.get(technologyId)?.skills || [];
	}

	/**
	 * Marca una tecnología como instalada
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
	 * Marca una tecnología como no instalada
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
	 * Busca tecnologías por nombre
	 */
	searchTechnologies(query: string): Technology[] {
		const lowerQuery = query.toLowerCase();
		return this.getAllTechnologies().filter(tech =>
			tech.name.toLowerCase().includes(lowerQuery) ||
			tech.id.toLowerCase().includes(lowerQuery)
		);
	}

	/**
	 * Filtra tecnologías que tengan skills asociados
	 */
	getTechnologiesWithSkills(): Technology[] {
		return this.getAllTechnologies().filter(tech => tech.skills && tech.skills.length > 0);
	}

	/**
	 * Obtiene el proyecto actual
	 */
	getCurrentProjectPath(): string {
		return this.projectPath;
	}

	/**
	 * Notifica cambios en las tecnologías
	 */
	private notifyTechnologiesChanged(): void {
		this.onTechnologiesChangedEmitter.fire(this.getAllTechnologies());
	}

	/**
	 * Limpia los recursos del servicio
	 */
	dispose(): void {
		this.onTechnologiesChangedEmitter.dispose();
	}

	
}
