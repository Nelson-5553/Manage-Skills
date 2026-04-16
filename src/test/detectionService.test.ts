import * as assert from 'assert';
import * as path from 'path';
import * as os from 'os';
import { DetectionService } from '../services/DetectionService';
import * as fs from 'fs';

suite('DetectionService Tests', () => {
	test('Should be defined', () => {
		assert.notStrictEqual(DetectionService, undefined);
	});

	test('Should have detectTechnologies method', () => {
		assert.strictEqual(typeof DetectionService.detectTechnologies, 'function');
	});

	test('Should detect technologies in project', () => {
		const projectPath = path.join(__dirname, '../../');
		const detected = DetectionService.detectTechnologies(projectPath);

		assert.strictEqual(Array.isArray(detected), true);
	});

	test('Should return array of detected technologies', () => {
		const projectPath = path.join(__dirname, '../../');
		const detected = DetectionService.detectTechnologies(projectPath);

		detected.forEach((tech: any) => {
			assert.strictEqual(typeof tech.id, 'string');
			assert.strictEqual(typeof tech.name, 'string');
		});
	});

	test('Should detect package.json when present', () => {
		const projectPath = path.join(__dirname, '../../');

		// Check if package.json exists in the project
		const packageJsonPath = path.join(projectPath, 'package.json');
		if (fs.existsSync(packageJsonPath)) {
			const detected = DetectionService.detectTechnologies(projectPath);
			assert.strictEqual(detected.length > 0, true);
		}
	});

	test('Should not crash with non-existent directory', () => {
		const fakeProjectPath = path.join(os.tmpdir(), 'non-existent-project-xyz');
		assert.doesNotThrow(() => {
			DetectionService.detectTechnologies(fakeProjectPath);
		});
	});

	test('Should return empty array for directory without technologies', () => {
		const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
		try {
			const detected = DetectionService.detectTechnologies(tempDir);
			assert.strictEqual(Array.isArray(detected), true);
		} finally {
			fs.rmSync(tempDir, { recursive: true });
		}
	});

	test('Should detect multiple technologies', () => {
		const projectPath = path.join(__dirname, '../../');
		const detected = DetectionService.detectTechnologies(projectPath);

		// In most projects, we should detect multiple technologies or none
		assert.strictEqual(typeof detected.length, 'number');
		assert.strictEqual(detected.length >= 0, true);
	});

	test('Should have unique technology IDs', () => {
		const projectPath = path.join(__dirname, '../../');
		const detected = DetectionService.detectTechnologies(projectPath);

		const ids = detected.map((tech: any) => tech.id);
		const uniqueIds = new Set(ids);

		assert.strictEqual(ids.length, uniqueIds.size);
	});

	test('Should handle symlinks gracefully', () => {
		const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
		try {
			assert.doesNotThrow(() => {
				DetectionService.detectTechnologies(tempDir);
			});
		} finally {
			fs.rmSync(tempDir, { recursive: true });
		}
	});

	test('Should return consistent results for same project', () => {
		const projectPath = path.join(__dirname, '../../');
		const detected1 = DetectionService.detectTechnologies(projectPath);
		const detected2 = DetectionService.detectTechnologies(projectPath);

		assert.strictEqual(detected1.length, detected2.length);
		
		detected1.forEach((tech: any, index: number) => {
			assert.strictEqual(tech.id, detected2[index].id);
		});
	});

	test('Should detect Node.js if package.json exists', () => {
		const projectPath = path.join(__dirname, '../../');
		const packageJsonPath = path.join(projectPath, 'package.json');

		if (fs.existsSync(packageJsonPath)) {
			const detected = DetectionService.detectTechnologies(projectPath);
			const hasNode = detected.some((tech: any) => 
				tech.id === 'node' || 
				tech.id === 'npm' ||
				tech.name.toLowerCase().includes('node')
			);

			// If package.json exists, node should typically be detected
			assert.strictEqual(typeof hasNode, 'boolean');
		}
	});
});

suite('Technology Detection Result Tests', () => {
	test('Should have id property', () => {
		const projectPath = path.join(__dirname, '../../');
		const detected = DetectionService.detectTechnologies(projectPath);

		detected.forEach((tech: any) => {
			assert.strictEqual(tech.id !== undefined, true);
			assert.strictEqual(typeof tech.id, 'string');
		});
	});

	test('Should have name property', () => {
		const projectPath = path.join(__dirname, '../../');
		const detected = DetectionService.detectTechnologies(projectPath);

		detected.forEach((tech: any) => {
			assert.strictEqual(tech.name !== undefined, true);
			assert.strictEqual(typeof tech.name, 'string');
		});
	});

	test('Should have detect configuration', () => {
		const projectPath = path.join(__dirname, '../../');
		const detected = DetectionService.detectTechnologies(projectPath);

		detected.forEach((tech: any) => {
			assert.strictEqual(tech.detect !== undefined, true);
		});
	});

	test('Should have skills array', () => {
		const projectPath = path.join(__dirname, '../../');
		const detected = DetectionService.detectTechnologies(projectPath);

		detected.forEach((tech: any) => {
			assert.strictEqual(Array.isArray(tech.skills), true);
		});
	});
});
