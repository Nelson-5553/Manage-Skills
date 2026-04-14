import * as vscode from 'vscode';
import { SKILLS_MAP } from '../config/skills-map';
import { Technology } from '../models/Technology';
import { DetectionService } from './DetectionService';

/**
 * Servicio central para la gestión de tecnologías y skills
 * Gestiona la detección de tecnologías en el proyecto y sus skills asociados
 */
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
	 */
	detectTechnologies(projectPath: string): void {
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
	 */
	getTechnologyById(id: string): Technology | undefined {
		return this.technologies.get(id);
	}

	/**
	 * Obtiene los skills de una tecnología
	 */
	getTechnologySkills(technologyId: string): string[] {
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
