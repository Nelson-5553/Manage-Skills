import * as fs from 'fs';
import * as path from 'path';
import { SKILLS_MAP, Technology } from '../config/skills-map';

/**
 * Servicio para detectar tecnologías instaladas en un proyecto
 */
export class DetectionService {
	/**
	 * Detecta todas las tecnologías instaladas en un directorio
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
	 * Verifica si una tecnología específica está instalada
	 */
	static isTechnologyInstalled(projectPath: string, tech: Technology): boolean {
		const { detect } = tech;

		// Verificar paquetes
		if (detect.packages && detect.packages.length > 0) {
			if (this.checkPackages(projectPath, detect.packages)) {
				return true;
			}
		}

		// Verificar patrones de paquetes (regex)
		if (detect.packagePatterns && detect.packagePatterns.length > 0) {
			if (this.checkPackagePatterns(projectPath, detect.packagePatterns)) {
				return true;
			}
		}

		// Verificar archivos de configuración
		if (detect.configFiles && detect.configFiles.length > 0) {
			if (this.checkConfigFiles(projectPath, detect.configFiles)) {
				return true;
			}
		}

		// Verificar gemas (Ruby)
		if (detect.gems && detect.gems.length > 0) {
			if (this.checkGems(projectPath, detect.gems)) {
				return true;
			}
		}

		// Verificar contenido de archivos de configuración
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
	 * Verifica si los paquetes especificados existen en package.json
	 */
	private static checkPackages(projectPath: string, packages: string[]): boolean {
		try {
			const packageJsonPath = path.join(projectPath, 'package.json');
			if (!fs.existsSync(packageJsonPath)) {
				return false;
			}

			const content = fs.readFileSync(packageJsonPath, 'utf-8');
			const packageJson = JSON.parse(content);

			const allDeps = {
				...packageJson.dependencies,
				...packageJson.devDependencies,
				...packageJson.peerDependencies,
			};

			return packages.some(pkg => allDeps.hasOwnProperty(pkg));
		} catch {
			return false;
		}
	}

	/**
	 * Verifica si hay paquetes que coincidan con los patrones especificados
	 */
	private static checkPackagePatterns(projectPath: string, patterns: RegExp[]): boolean {
		try {
			const packageJsonPath = path.join(projectPath, 'package.json');
			if (!fs.existsSync(packageJsonPath)) {
				return false;
			}

			const content = fs.readFileSync(packageJsonPath, 'utf-8');
			const packageJson = JSON.parse(content);

			const allDeps = {
				...packageJson.dependencies,
				...packageJson.devDependencies,
				...packageJson.peerDependencies,
			};

			const packageNames = Object.keys(allDeps);
			return patterns.some(pattern => packageNames.some(name => pattern.test(name)));
		} catch {
			return false;
		}
	}

	/**
	 * Verifica si los archivos de configuración existen
	 */
	private static checkConfigFiles(projectPath: string, configFiles: string[]): boolean {
		return configFiles.some(file => {
			const filePath = path.join(projectPath, file);
			return fs.existsSync(filePath);
		});
	}

	/**
	 * Verifica si existen gemas especificadas (Ruby)
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
	 * Verifica contenido de archivos de configuración
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

				// Si es archivo de Gradle, procesar de forma especial
				if (config.scanGradleLayout && (file.endsWith('.gradle') || file.endsWith('build.gradle'))) {
					return this.checkGradleContent(content, config.patterns);
				}

				// Búsqueda normal de patrones
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
	 * Verifica contenido específico de archivos Gradle
	 */
	private static checkGradleContent(content: string, patterns: string[]): boolean {
		return patterns.some(pattern => content.includes(pattern));
	}
}
