import * as vscode from 'vscode';
import { promisify } from 'util';
import { exec } from 'child_process';
import { SkillsService } from './SkillsService';
import { SkillCommandBuilder } from './SkillCommandBuilder';
import { AgentDetector } from './AgentDetector';

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
 * Tipo de notificación final
 */
type NotificationType = 'info' | 'warning' | 'error';

/**
 * Servicio para manejar la instalación de skills
 * Soporta diferentes tipos de instalación: individual, todas las tech skills, y todas las sugeridas
 */
export class InstallSkillService {
	private skillCommandBuilder: SkillCommandBuilder;
	private agentDetector: AgentDetector;

	constructor(private skillsService: SkillsService) {
		this.skillCommandBuilder = new SkillCommandBuilder();
		this.agentDetector = new AgentDetector();
	}

	/**
	 * Wrapper que ejecuta una operación con progress bar y muestra un único mensaje final
	 * La operación retorna { results, finalNotification }
	 * Evita bombardear al usuario con múltiples notificaciones
	 */
	private async withProgressNotification<T>(
		title: string,
		operation: (progress: vscode.Progress<{ message?: string; increment?: number }>) => Promise<{
			results: T;
			finalNotification?: {
				type: NotificationType;
				message: string;
			};
		}>
	): Promise<T> {
		const { results, finalNotification } = await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title,
				cancellable: false
			},
			operation
		);

		// Mostrar única notificación final si se especifica
		if (finalNotification) {
			switch (finalNotification.type) {
				case 'info':
					vscode.window.showInformationMessage(finalNotification.message);
					break;
				case 'warning':
					vscode.window.showWarningMessage(finalNotification.message);
					break;
				case 'error':
					vscode.window.showErrorMessage(finalNotification.message, "View Details").then(selection => {
						if (selection === "View Details") {
							console.error(finalNotification.message);
						}
					});
					break;
			}
		}

		return results;
	}

	/**
	 * Versión silenciosa de instalación para uso interno
	 * Solo ejecuta la instalación sin mostrar notificaciones
	 */
	private async installSkillSilent(skillName: string): Promise<InstallResult> {
		try {
			const projectPath = this.skillsService.getCurrentProjectPath();
			const agent = this.agentDetector.detect(projectPath);
			const command = this.skillCommandBuilder.buildInstallCommand(skillName, agent);

			await execAsync(command, {
				cwd: projectPath
			});

			return {
				success: true,
				skillName,
				message: `Skill "${skillName}" installed successfully`
			};

		} catch (error) {
			console.error(error);

			return {
				success: false,
				skillName,
				message: `Failed to install "${skillName}"`,
				error: error instanceof Error ? error : new Error(String(error))
			};
		}
	}

	/**
	 * Instala un skill individual
	 */
	async installSkill(skillName: string): Promise<InstallResult> {
		try {
			const projectPath = this.skillsService.getCurrentProjectPath();
			const agent = this.agentDetector.detect(projectPath);
			const command = this.skillCommandBuilder.buildInstallCommand(skillName, agent);

			await this.withProgressNotification(
				`Installing "${skillName}"...`,
				async (progress) => {
					progress.report({ message: 'Running installation...' });
					await execAsync(command, {
						cwd: projectPath
					});
					progress.report({ message: 'Completed' });
					
					return {
						results: undefined,
						finalNotification: {
							type: 'info' as const,
							message: `Skill "${skillName}" installed successfully`
						}
					};
				}
			);

			return {
				success: true,
				skillName,
				message: `Skill "${skillName}" installed successfully`
			};

		} catch (error) {
			console.error(error);

			const message = `Failed to install "${skillName}"`;

			await this.withProgressNotification(
				`Installing "${skillName}"...`,
				async () => {
					return {
						results: undefined,
						finalNotification: {
							type: 'error' as const,
							message
						}
					};
				}
			);

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
		const installedTechs = this.skillsService.getInstalledTechnologies();
		const results: InstallResult[] = [];

		if (installedTechs.length === 0) {
			vscode.window.showWarningMessage('No hay tecnologías detectadas en el proyecto');
			return results;
		}

		// Obtener todos los skills de las tecnologías instaladas
		const skillsToInstall: string[] = [];
		installedTechs.forEach(tech => {
			if (tech.skills && tech.skills.length > 0) {
				skillsToInstall.push(...tech.skills);
			}
		});

		if (skillsToInstall.length === 0) {
			vscode.window.showWarningMessage('No hay skills técnicos para instalar');
			return results;
		}

		try {
			const installResults = await this.withProgressNotification(
				`Installing ${skillsToInstall.length} skill(s) from ${installedTechs.length} technology(ies)...`,
				async (progress) => {
					const progressIncrement = 100 / skillsToInstall.length;

					// Instalar cada skill silenciosamente
					for (const skill of skillsToInstall) {
						const result = await this.installSkillSilent(skill);
						results.push(result);
						progress.report({ increment: progressIncrement });
					}
					
					return {
						results: results,
						finalNotification: {
							type: results.every(r => r.success) ? 'info' as const : 'warning' as const,
							message: this.getInstallationSummaryMessage(results)
						}
					};
				}
			);

			return installResults;
		} catch (error) {
			const message = 'Error al instalar todos los skills técnicos';
			console.error(error);

			vscode.window.showErrorMessage(message);

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
		const results: InstallResult[] = [];

		if (suggestedSkills.length === 0) {
			vscode.window.showWarningMessage('No hay skills sugeridos para instalar');
			return results;
		}

		try {
			const installResults = await this.withProgressNotification(
				`Installing ${suggestedSkills.length} suggested skill(s)...`,
				async (progress) => {
					const progressIncrement = 100 / suggestedSkills.length;

					// Instalar cada skill sugerido silenciosamente
					for (const skill of suggestedSkills) {
						const result = await this.installSkillSilent(skill);
						results.push(result);
						progress.report({ increment: progressIncrement });
					}
					
					return {
						results: results,
						finalNotification: {
							type: results.every(r => r.success) ? 'info' as const : 'warning' as const,
							message: this.getInstallationSummaryMessage(results)
						}
					};
				}
			);

			return installResults;
		} catch (error) {
			const message = 'Error al instalar los skills sugeridos';
			console.error(error);

			vscode.window.showErrorMessage(message);

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
		const { stopOnError = false } = options || {};

		if (skills.length === 0) {
			vscode.window.showWarningMessage('No skills to install');
			return results;
		}

		try {
			const installResults = await this.withProgressNotification(
				`Installing ${skills.length} skill(s)...`,
				async (progress) => {
					const progressIncrement = 100 / skills.length;

					for (let i = 0; i < skills.length; i++) {
						const skill = skills[i];
						const result = await this.installSkillSilent(skill);
						results.push(result);

						if (stopOnError && !result.success) {
							break;
						}

						progress.report({ increment: progressIncrement });
					}
					
					return {
						results: results,
						finalNotification: {
							type: results.every(r => r.success) ? 'info' as const : 'warning' as const,
							message: this.getInstallationSummaryMessage(results)
						}
					};
				}
			);

			return installResults;
		} catch (error) {
			const message = 'Error installing multiple skills';
			console.error(error);

			vscode.window.showErrorMessage(message);

			return [
				{
					success: false,
					skillName: 'multiple-skills',
					message,
					error: error instanceof Error ? error : new Error(String(error))
				}
			];
		}
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

	/**
	 * Genera mensaje de resumen de instalación
	 */
	private getInstallationSummaryMessage(results: InstallResult[]): string {
		const { successCount, failCount, totalSkills } = this.getInstallationSummary(results);

		if (failCount === 0) {
			return `All ${totalSkills} skills installed successfully`;
		} else {
			return `Installed ${successCount}/${totalSkills} skills. ${failCount} failed`;
		}
	}
}
