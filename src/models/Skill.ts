/**
 * Modelo que representa una habilidad (skill) en el sistema
 */
export interface Skill {
	id: string;
	name: string;
	description: string;
	category: SkillCategory;
	icon?: string;
	installed: boolean;
	installPath?: string;
	version?: string;
	source: SkillSource;
	tags?: string[];
	metadata?: Record<string, unknown>;
}

/**
 * Categorías disponibles para las habilidades
 */
export enum SkillCategory {
	LANGUAGE = 'language',
	FRAMEWORK = 'framework',
	TOOL = 'tool',
	EXTENSION = 'extension',
	BACKEND = 'backend',
	FRONTEND = 'frontend',
	DATABASE = 'database',
	OTHER = 'other'
}

/**
 * Fuente de donde proviene el skill
 */
export enum SkillSource {
	LOCAL = 'local',
	MARKETPLACE = 'marketplace',
	GITHUB = 'github',
	CUSTOM = 'custom'
}

/**
 * Estado de instalación de un skill
 */
export interface SkillInstallationState {
	skillId: string;
	installed: boolean;
	installedAt?: Date;
	version?: string;
	location?: string;
}
