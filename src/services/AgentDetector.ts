import * as fs from 'fs';
import * as path from 'path';
import { AGENT_FOLDER_MAP } from '../config/skills-map';

/**
 * Servicio para detectar el agente IA en el workspace
 * Identifica qué agente IA está siendo utilizado (OpenCode, Claude, etc.)
 */
export class AgentDetector {
	/**
	 * Detecta el agente IA basado en la estructura de carpetas del workspace
	 * 
	 * @param workspacePath - Ruta del workspace
	 * @returns ID del agente detectado, o "universal" si no se encuentra ninguno específico
	 * 
	 * @example
	 * ```typescript
	 * const detector = new AgentDetector();
	 * const agent = detector.detect('/path/to/project');
	 * // Returns: "opencode", "claude", or "universal"
	 * ```
	 */
	detect(workspacePath: string): string {
		if (!workspacePath || typeof workspacePath !== 'string') {
			return "universal";
		}

		try {
			for (const [folder, agent] of Object.entries(AGENT_FOLDER_MAP)) {
				const folderPath = path.join(workspacePath, folder);
				if (fs.existsSync(folderPath)) {
					return agent;
				}
			}
		} catch (error) {
			// Si hay error al verificar, devolvemos universal
			console.debug(`Error detecting agent in ${workspacePath}:`, error);
		}

		return "universal";
	}

	/**
	 * Obtiene el mapeo de carpetas a agentes
	 * Útil para entender qué carpetas se buscan
	 */
	getAgentFolderMap(): Record<string, string> {
		return { ...AGENT_FOLDER_MAP };
	}

	/**
	 * Registra un nuevo mapeo de carpeta a agente
	 * Permite extensiones adicionales de agentes
	 * 
	 * @param folderName - Nombre de la carpeta característica del agente
	 * @param agentId - ID del agente
	 */
	registerAgent(folderName: string, agentId: string): void {
		if (!folderName || !agentId) {
			throw new Error("folderName and agentId are required");
		}

		AGENT_FOLDER_MAP[folderName] = agentId;
	}

	/**
	 * Obtiene todos los agentes soportados
	 */
	getSupportedAgents(): string[] {
		const agents = new Set(Object.values(AGENT_FOLDER_MAP));
		agents.add("universal");
		return Array.from(agents);
	}

	/**
	 * Verifica si un agente es soportado
	 */
	isAgentSupported(agentId: string): boolean {
		return this.getSupportedAgents().includes(agentId);
	}
}
