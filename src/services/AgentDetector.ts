import * as fs from 'fs';
import * as path from 'path';
import { AGENT_FOLDER_MAP } from '../config/skills-map';

/**
 * Service to detect the AI agent in the workspace
 * Identifies which AI agent is being used (OpenCode, Claude, etc.)
 */
export class AgentDetector {
	/**
	 * Detects the AI agent based on the workspace folder structure
	 * 
	 * @param workspacePath - Workspace path
	 * @returns ID of the detected agent, or "universal" if none is found
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
			// If there's an error checking, we return universal
			console.debug(`Error detecting agent in ${workspacePath}:`, error);
		}

		return "universal";
	}

	/**
	 * Gets the folder to agent mapping
	 * Useful for understanding which folders are searched
	 */
	getAgentFolderMap(): Record<string, string> {
		return { ...AGENT_FOLDER_MAP };
	}

	/**
	 * Registers a new folder to agent mapping
	 * Allows additional agent extensions
	 * 
	 * @param folderName - Name of the folder characteristic of the agent
	 * @param agentId - Agent ID
	 */
	registerAgent(folderName: string, agentId: string): void {
		if (!folderName || !agentId) {
			throw new Error("folderName and agentId are required");
		}

		AGENT_FOLDER_MAP[folderName] = agentId;
	}

	/**
	 * Gets all supported agents
	 */
	getSupportedAgents(): string[] {
		const agents = new Set(Object.values(AGENT_FOLDER_MAP));
		agents.add("universal");
		return Array.from(agents);
	}

	/**
	 * Checks if an agent is supported
	 */
	isAgentSupported(agentId: string): boolean {
		return this.getSupportedAgents().includes(agentId);
	}
}
