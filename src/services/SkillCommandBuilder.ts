/**
 * Service to build skill installation commands
 * Encapsulates the logic for building skill paths and commands
 */
export class SkillCommandBuilder {
	/**
	 * Builds the installation command for a skill
	 * 
	 * @param skillName - Skill path (e.g., "vercel-labs/agent-skills/react-best-practices")
	 * @param agent - Agent ID (e.g., "opencode", "claude", or "universal" by default)
	 * @returns npm command to install the skill
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
	 * Validates if a skill path is valid
	 * 
	 * @param skillName - Skill path to validate
	 * @returns true if the path is valid, false otherwise
	 */
	isValidSkillPath(skillName: string): boolean {
		if (!skillName || typeof skillName !== 'string') {
			return false;
		}

		const parts = skillName.split('/');
		// Must have at least 2 parts: repo/skill or owner/repo/skill
		return parts.length >= 2 && parts.every(part => part.length > 0);
	}

	/**
	 * Extracts the human-readable skill name
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
	 * Extracts the owner/repo of the skill
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
