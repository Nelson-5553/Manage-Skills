/**
 * Servicio para construir comandos de instalación de skills
 * Encapsula la lógica de construcción de rutas de skills y comandos
 */
export class SkillCommandBuilder {
	/**
	 * Construye el comando de instalación para un skill
	 * 
	 * @param skillName - Ruta del skill (ej: "vercel-labs/agent-skills/react-best-practices")
	 * @param agent - ID del agente (ej: "opencode", "claude", o "universal" por defecto)
	 * @returns Comando npm para instalar el skill
	 * 
	 * @example
	 * ```typescript
	 * const builder = new SkillCommandBuilder();
	 * const cmd = builder.buildInstallCommand(
	 *   "vercel-labs/agent-skills/react-best-practices",
	 *   "opencode"
	 * );
	 * // Returns: "npx -y skills add vercel-labs/agent-skills --skill react-best-practices -a opencode -y"
	 * ```
	 */
	buildInstallCommand(skillName: string, agent: string = "universal"): string {
		const elements = skillName.split('/');
		
		if (elements.length === 0) {
			throw new Error(`Invalid skill name: "${skillName}". Must contain at least one part.`);
		}
		
		let repo: string;
		let skill: string;
		
		if (elements.length === 2) {
			// Special case: two-part skill path (no owner)
			// Format: "repo/skill"
			repo = elements[0];
			skill = elements[1];
		} else {
			// Normal case: owner/repo/skill/path
			// Format: "owner/repo/skill/subskill/..."
			repo = elements.slice(0, 2).join("/");
			skill = elements.slice(2).join("/");
		}

		return `npx -y skills add ${repo} --skill ${skill} -a ${agent} -y`;
	}

	/**
	 * Valida si una ruta de skill es válida
	 * 
	 * @param skillName - Ruta del skill a validar
	 * @returns true si la ruta es válida, false en caso contrario
	 */
	isValidSkillPath(skillName: string): boolean {
		if (!skillName || typeof skillName !== 'string') {
			return false;
		}

		const parts = skillName.split('/');
		// Debe tener al menos 2 partes: repo/skill o owner/repo/skill
		return parts.length >= 2 && parts.every(part => part.length > 0);
	}

	/**
	 * Extrae el nombre legible del skill
	 * 
	 * @example
	 * ```typescript
	 * extractSkillName("vercel-labs/agent-skills/react-best-practices")
	 * // Returns: "react-best-practices"
	 * ```
	 */
	extractSkillName(skillPath: string): string {
		const parts = skillPath.split('/');
		return parts[parts.length - 1];
	}

	/**
	 * Extrae el owner/repo del skill
	 * 
	 * @example
	 * ```typescript
	 * extractRepository("vercel-labs/agent-skills/react-best-practices")
	 * // Returns: "vercel-labs/agent-skills"
	 * ```
	 */
	extractRepository(skillPath: string): string {
		const parts = skillPath.split('/');
		if (parts.length < 2) {
			throw new Error(`Invalid skill path: "${skillPath}"`);
		}
		return parts.slice(0, 2).join('/');
	}
}
