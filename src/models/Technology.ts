import { Technology as SkillMapTechnology } from '../config/skills-map';

/**
 * Technology model with state properties
 */
export interface Technology extends SkillMapTechnology {
	installed: boolean;
	detectedAt?: Date;
}

/**
 * Technology installation state
 */
export interface TechnologyInstallationState {
	technologyId: string;
	installed: boolean;
	detectedAt?: Date;
	detectionMethod?: 'package' | 'configFile' | 'fileContent';
}
