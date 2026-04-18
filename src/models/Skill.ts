/**
 * Skill model
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
 * Skill categories
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
 * Skill source
 */
export enum SkillSource {
	LOCAL = 'local',
	MARKETPLACE = 'marketplace',
	GITHUB = 'github',
	CUSTOM = 'custom'
}

/**
 * Skill installation state
 */
export interface SkillInstallationState {
	skillId: string;
	installed: boolean;
	installedAt?: Date;
	version?: string;
	location?: string;
}
