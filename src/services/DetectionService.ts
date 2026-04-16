import * as fs from 'fs';
import * as path from 'path';
import { SKILLS_MAP, Technology } from '../config/skills-map';
import { AgentDetector } from './AgentDetector';

// Re-export for backward compatibility
const agentDetector = new AgentDetector();

/**
 * @deprecated Use AgentDetector.detect() instead
 * Maintained for backward compatibility
 */
export function DetectAgent(workspacePath: string): string | undefined {
	return agentDetector.detect(workspacePath);
}
	
export class DetectionService {
	/**
	 * Detects all installed technologies in a directory
	 */
	static detectTechnologies(projectPath: string): Technology[] {
		const detectedTechs: Technology[] = [];

		for (const tech of SKILLS_MAP) {
			if (this.isTechnologyInstalled(projectPath, tech)) {
				detectedTechs.push(tech);
			}
		}

		return detectedTechs;
	}

	/**
	 * Checks if a specific technology is installed
	 */
	static isTechnologyInstalled(projectPath: string, tech: Technology): boolean {
		const { detect } = tech;

		// Check packages
		if (detect.packages && detect.packages.length > 0) {
			if (this.checkPackages(projectPath, detect.packages)) {
				return true;
			}
		}

		// Check package patterns (regex)
		if (detect.packagePatterns && detect.packagePatterns.length > 0) {
			if (this.checkPackagePatterns(projectPath, detect.packagePatterns)) {
				return true;
			}
		}

		// Check configuration files
		if (detect.configFiles && detect.configFiles.length > 0) {
			if (this.checkConfigFiles(projectPath, detect.configFiles)) {
				return true;
			}
		}

		// Check gems (Ruby)
		if (detect.gems && detect.gems.length > 0) {
			if (this.checkGems(projectPath, detect.gems)) {
				return true;
			}
		}

		// Check configuration file content
		if (detect.configFileContent) {
			const configs = Array.isArray(detect.configFileContent)
				? detect.configFileContent
				: [detect.configFileContent];

			for (const config of configs) {
				if (this.checkConfigFileContent(projectPath, config)) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Reads and parses the project's package.json file
	 * @private
	 * @throws Does not throw exception, returns null on error
	 */
	private static readPackageJson(projectPath: string): Record<string, any> | null {
		try {
			const packageJsonPath = path.join(projectPath, 'package.json');
			if (!fs.existsSync(packageJsonPath)) {
				return null;
			}

			const content = fs.readFileSync(packageJsonPath, 'utf-8');
			return JSON.parse(content);
		} catch (error) {
			return null;
		}
	}

	/**
	 * Gets all dependencies from a parsed package.json
	 * @private
	 */
	private static getAllDependencies(packageJson: Record<string, any>): Record<string, any> {
		return {
			...packageJson.dependencies,
			...packageJson.devDependencies,
			...packageJson.peerDependencies,
		};
	}

	/**
	 * Checks if the specified packages exist in package.json
	 */
	private static checkPackages(projectPath: string, packages: string[]): boolean {
		const packageJson = this.readPackageJson(projectPath);
		if (!packageJson) {
			return false;
		}

		const allDeps = this.getAllDependencies(packageJson);
		return packages.some(pkg => allDeps.hasOwnProperty(pkg));
	}

	/**
	 * Checks if there are packages matching the specified patterns
	 */
	private static checkPackagePatterns(projectPath: string, patterns: RegExp[]): boolean {
		const packageJson = this.readPackageJson(projectPath);
		if (!packageJson) {
			return false;
		}

		const allDeps = this.getAllDependencies(packageJson);
		const packageNames = Object.keys(allDeps);
		return patterns.some(pattern => packageNames.some(name => pattern.test(name)));
	}

	/**
	 * Checks if the configuration files exist
	 */
	private static checkConfigFiles(projectPath: string, configFiles: string[]): boolean {
		return configFiles.some(file => {
			const filePath = path.join(projectPath, file);
			return fs.existsSync(filePath);
		});
	}

	/**
	 * Checks if specified gems exist (Ruby)
	 */
	private static checkGems(projectPath: string, gems: string[]): boolean {
		try {
			const gemfilePath = path.join(projectPath, 'Gemfile');
			if (!fs.existsSync(gemfilePath)) {
				return false;
			}

			const content = fs.readFileSync(gemfilePath, 'utf-8');
			return gems.some(gem => content.includes(`'${gem}'`) || content.includes(`"${gem}"`));
		} catch {
			return false;
		}
	}

	/**
	 * Checks configuration file content
	 */
	private static checkConfigFileContent(
		projectPath: string,
		config: { files?: string[]; patterns: string[]; scanGradleLayout?: boolean }
	): boolean {
		const files = config.files || [];

		for (const file of files) {
			const filePath = path.join(projectPath, file);

			if (!fs.existsSync(filePath)) {
				continue;
			}

			try {
				const content = fs.readFileSync(filePath, 'utf-8');

				// If it's a Gradle file, process specially
				if (config.scanGradleLayout && (file.endsWith('.gradle') || file.endsWith('build.gradle'))) {
					return this.checkGradleContent(content, config.patterns);
				}

				// Normal pattern search
				if (config.patterns.some(pattern => content.includes(pattern))) {
					return true;
				}
			} catch {
				continue;
			}
		}

		return false;
	}

	/**
	 * Checks specific content of Gradle files
	 */
	private static checkGradleContent(content: string, patterns: string[]): boolean {
		return patterns.some(pattern => content.includes(pattern));
	}
}
