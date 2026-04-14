import { Technology as SkillMapTechnology } from '../config/skills-map';

/**
 * Modelo extendido de Technology que incluye propiedades de estado
 */
export interface Technology extends SkillMapTechnology {
	installed: boolean;
	detectedAt?: Date;
}

/**
 * Estado de instalación de una tecnología
 */
export interface TechnologyInstallationState {
	technologyId: string;
	installed: boolean;
	detectedAt?: Date;
	detectionMethod?: 'package' | 'configFile' | 'fileContent';
}
