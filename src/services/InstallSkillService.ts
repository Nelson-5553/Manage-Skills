import * as vscode from 'vscode';
import { promisify } from 'util';
import { exec } from 'child_process';
import { BuildSkillPath, SkillsService } from './SkillsService';
import { DetectAgent } from './DetectionService';

const execAsync = promisify(exec);

/**
 * Resultado de la instalación de un skill
 */
export interface InstallResult {
	success: boolean;
	skillName: string;
	message: string;
	error?: Error;
}

/**
 * Servicio para manejar la instalación de skills
 * Soporta diferentes tipos de instalación: individual, todas las tech skills, y todas las sugeridas
 */
export class InstallSkillService {
	constructor(private skillsService: SkillsService) {}

	/**
	 * Instala un skill individual
	 */
	async installSkill(skillName: string): Promise<InstallResult> {
  try {
    const command = BuildSkillPath(
      skillName,
      DetectAgent(this.skillsService.getCurrentProjectPath())
    );

    vscode.window.showInformationMessage(
      `Installing "${skillName}"...`
    );

    await execAsync(command, {
      cwd: this.skillsService.getCurrentProjectPath()
    });

    const message = `Skill "${skillName}" installed successfully`;
    vscode.window.showInformationMessage(message);

    return {
      success: true,
      skillName,
      message
    };

  } catch (error) {
    console.error(error);

    const message = `Failed to install "${skillName}"`;
    
    vscode.window.showErrorMessage(
      message,
      "View Details"
    ).then(selection => {
      if (selection === "View Details") {
        console.error(error);
      }
    });

    return {
      success: false,
      skillName,
      message,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}
	/**
	 * Instala todos los skills técnicos de las tecnologías detectadas
	 */
	async installAllTechSkills(): Promise<InstallResult[]> {
		try {
			const installedTechs = this.skillsService.getInstalledTechnologies();
			const results: InstallResult[] = [];

			if (installedTechs.length === 0) {
				vscode.window.showWarningMessage('No hay tecnologías detectadas en el proyecto');
				return results;
			}

			vscode.window.showInformationMessage(
				`Instalando skills técnicos para ${installedTechs.length} tecnología(s)...`
			);

			// Obtener todos los skills de las tecnologías instaladas
			const skillsToInstall: string[] = [];
			installedTechs.forEach(tech => {
				if (tech.skills && tech.skills.length > 0) {
					skillsToInstall.push(...tech.skills);
				}
			});

			// Instalar cada skill
			for (const skill of skillsToInstall) {
				const result = await this.installSkill(skill);
				results.push(result);
			}

			// Mostrar resumen
			const successCount = results.filter(r => r.success).length;
			const failCount = results.filter(r => !r.success).length;

			if (failCount === 0) {
				vscode.window.showInformationMessage(
					`Todos los ${successCount} skills técnicos se instalaron correctamente`
				);
			} else {
				vscode.window.showWarningMessage(
					`Se instalaron ${successCount} skills, pero ${failCount} fallaron`
				);
			}

			return results;
		} catch (error) {
			const message = 'Error al instalar todos los skills técnicos';
			vscode.window.showErrorMessage(message);
			console.error(error);

			return [
				{
					success: false,
					skillName: 'all-tech-skills',
					message,
					error: error instanceof Error ? error : new Error(String(error))
				}
			];
		}
	}

	/**
	 * Instala todos los skills sugeridos
	 * Los skills sugeridos pueden venir de una lista predefinida o de una configuración
	 */
	async installAllSuggestedSkills(suggestedSkills: string[]): Promise<InstallResult[]> {
		try {
			const results: InstallResult[] = [];

			if (suggestedSkills.length === 0) {
				vscode.window.showWarningMessage('No hay skills sugeridos para instalar');
				return results;
			}

			vscode.window.showInformationMessage(
				`Instalando ${suggestedSkills.length} skill(s) sugerido(s)...`
			);

			// Instalar cada skill sugerido
			for (const skill of suggestedSkills) {
				const result = await this.installSkill(skill);
				results.push(result);
			}

			// Mostrar resumen
			const successCount = results.filter(r => r.success).length;
			const failCount = results.filter(r => !r.success).length;

			if (failCount === 0) {
				vscode.window.showInformationMessage(
					`Todos los ${successCount} skills sugeridos se instalaron correctamente`
				);
			} else {
				vscode.window.showWarningMessage(
					`Se instalaron ${successCount} skills sugeridos, pero ${failCount} fallaron`
				);
			}

			return results;
		} catch (error) {
			const message = 'Error al instalar los skills sugeridos';
			vscode.window.showErrorMessage(message);
			console.error(error);

			return [
				{
					success: false,
					skillName: 'all-suggested-skills',
					message,
					error: error instanceof Error ? error : new Error(String(error))
				}
			];
		}
	}

	/**
	 * Instala múltiples skills de forma secuencial con control de progreso
	 */
	async installMultipleSkills(
		skills: string[],
		options?: {
			showProgress?: boolean;
			stopOnError?: boolean;
		}
	): Promise<InstallResult[]> {
		const results: InstallResult[] = [];
		const { showProgress = true, stopOnError = false } = options || {};

		for (let i = 0; i < skills.length; i++) {
			const skill = skills[i];

			if (showProgress) {
				vscode.window.showInformationMessage(
					`Instalando skill ${i + 1}/${skills.length}: ${skill}`
				);
			}

			const result = await this.installSkill(skill);
			results.push(result);

			if (stopOnError && !result.success) {
				vscode.window.showWarningMessage(
					`Instalación detenida. El skill ${skill} falló`
				);
				break;
			}
		}

		return results;
	}

	/**
	 * Obtiene el estado de la última instalación
	 */
	getInstallationSummary(results: InstallResult[]): {
		totalSkills: number;
		successCount: number;
		failCount: number;
		successPercentage: number;
	} {
		const successCount = results.filter(r => r.success).length;
		const failCount = results.filter(r => !r.success).length;
		const totalSkills = results.length;
		const successPercentage = totalSkills > 0 ? (successCount / totalSkills) * 100 : 0;

		return {
			totalSkills,
			successCount,
			failCount,
			successPercentage
		};
	}
}
