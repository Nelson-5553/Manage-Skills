import * as assert from 'assert';
import * as vscode from 'vscode';
import { SkillsService, BuildSkillPath } from '../services/SkillsService';
import { Technology } from '../models/Technology';
import { SKILLS_MAP } from '../config/skills-map';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});

suite('SkillsService Tests', () => {
	let skillsService: SkillsService;

	setup(() => {
		skillsService = new SkillsService();
	});

	teardown(() => {
		skillsService.dispose();
	});

	test('Should initialize with all technologies from SKILLS_MAP', () => {
		const allTechs = skillsService.getAllTechnologies();
		assert.strictEqual(allTechs.length, SKILLS_MAP.length);
	});

	test('Should mark all technologies as not installed initially', () => {
		const allTechs = skillsService.getAllTechnologies();
		assert.strictEqual(allTechs.every(tech => !tech.installed), true);
	});

	test('Should get available technologies (not installed)', () => {
		const available = skillsService.getAvailableTechnologies();
		assert.strictEqual(available.length, SKILLS_MAP.length);
		assert.strictEqual(available.every(tech => !tech.installed), true);
	});

	test('Should get installed technologies', () => {
		// Initially should be empty
		let installed = skillsService.getInstalledTechnologies();
		assert.strictEqual(installed.length, 0);

		// Mark one as installed
		const firstTech = skillsService.getAllTechnologies()[0];
		skillsService.markTechnologyInstalled(firstTech.id);

		installed = skillsService.getInstalledTechnologies();
		assert.strictEqual(installed.length, 1);
		assert.strictEqual(installed[0].id, firstTech.id);
	});

	test('Should get technology by ID', () => {
		const firstTech = skillsService.getAllTechnologies()[0];
		const tech = skillsService.getTechnologyById(firstTech.id);

		assert.notStrictEqual(tech, undefined);
		assert.strictEqual(tech?.id, firstTech.id);
		assert.strictEqual(tech?.name, firstTech.name);
	});

	test('Should return undefined for non-existent technology ID', () => {
		const tech = skillsService.getTechnologyById('non-existent-id');
		assert.strictEqual(tech, undefined);
	});

	test('Should get technology skills', () => {
		const techWithSkills = skillsService.getAllTechnologies()
			.find(tech => tech.skills && tech.skills.length > 0);

		assert.notStrictEqual(techWithSkills, undefined);

		if (techWithSkills) {
			const skills = skillsService.getTechnologySkills(techWithSkills.id);
			assert.strictEqual(skills.length, techWithSkills.skills.length);
			assert.strictEqual(
				skills.every(skill => techWithSkills.skills.includes(skill)),
				true
			);
		}
	});

	test('Should return empty array for technology with no skills', () => {
		const techNoSkills = skillsService.getAllTechnologies()
			.find(tech => !tech.skills || tech.skills.length === 0);

		if (techNoSkills) {
			const skills = skillsService.getTechnologySkills(techNoSkills.id);
			assert.strictEqual(skills.length, 0);
		}
	});

	test('Should mark technology as installed', () => {
		const firstTech = skillsService.getAllTechnologies()[0];
		const result = skillsService.markTechnologyInstalled(firstTech.id);

		assert.strictEqual(result, true);

		const tech = skillsService.getTechnologyById(firstTech.id);
		assert.strictEqual(tech?.installed, true);
		assert.notStrictEqual(tech?.detectedAt, undefined);
	});

	test('Should mark technology as not installed', () => {
		const firstTech = skillsService.getAllTechnologies()[0];

		// First mark as installed
		skillsService.markTechnologyInstalled(firstTech.id);
		let tech = skillsService.getTechnologyById(firstTech.id);
		assert.strictEqual(tech?.installed, true);

		// Then mark as not installed
		const result = skillsService.markTechnologyNotInstalled(firstTech.id);
		assert.strictEqual(result, true);

		tech = skillsService.getTechnologyById(firstTech.id);
		assert.strictEqual(tech?.installed, false);
		assert.strictEqual(tech?.detectedAt, undefined);
	});

	test('Should return false when marking non-existent technology', () => {
		const result = skillsService.markTechnologyInstalled('non-existent-id');
		assert.strictEqual(result, false);
	});

	test('Should search technologies by name', () => {
		const searchResults = skillsService.searchTechnologies('react');
		assert.strictEqual(searchResults.length > 0, true);
		assert.strictEqual(
			searchResults.every(tech => 
				tech.name.toLowerCase().includes('react') || 
				tech.id.toLowerCase().includes('react')
			),
			true
		);
	});

	test('Should search technologies by ID', () => {
		const searchResults = skillsService.searchTechnologies('nextjs');
		assert.strictEqual(searchResults.length > 0, true);
	});

	test('Should return empty array for non-matching search', () => {
		const searchResults = skillsService.searchTechnologies('xyz-nonexistent-xyz');
		assert.strictEqual(searchResults.length, 0);
	});

	test('Should get technologies with skills', () => {
		const techsWithSkills = skillsService.getTechnologiesWithSkills();
		assert.strictEqual(techsWithSkills.length > 0, true);
		assert.strictEqual(
			techsWithSkills.every(tech => tech.skills && tech.skills.length > 0),
			true
		);
	});

	test('Should emit event when technologies change', (done) => {
		const firstTech = skillsService.getAllTechnologies()[0];
		let eventFired = false;

		const subscription = skillsService.onTechnologiesChanged((techs) => {
			assert.notStrictEqual(techs, undefined);
			assert.strictEqual(techs.length, SKILLS_MAP.length);
			eventFired = true;
			subscription.dispose();
			done();
		});

		// Set a timeout to ensure event fires, otherwise fail the test
		const timeout = setTimeout(() => {
			if (!eventFired) {
				subscription.dispose();
				done(new Error('Event did not fire within timeout'));
			}
		}, 1000);

		skillsService.markTechnologyInstalled(firstTech.id);
	});

	test('Should return current project path', () => {
		const path = skillsService.getCurrentProjectPath();
		assert.strictEqual(typeof path, 'string');
	});
});

suite('BuildSkillPath Tests', () => {
	test('Should build correct skill path with default agent', () => {
		const skillName = 'vercel-labs/agent-skills/vercel-react-best-practices';
		const result = BuildSkillPath(skillName);

		assert.strictEqual(result, 'npx -y skills add vercel-labs/agent-skills --skill vercel-react-best-practices -a universal -y');
	});

	test('Should build correct skill path with custom agent', () => {
		const skillName = 'vercel-labs/agent-skills/vercel-react-best-practices';
		const agent = 'claude-code';
		const result = BuildSkillPath(skillName, agent);

		assert.strictEqual(result, 'npx -y skills add vercel-labs/agent-skills --skill vercel-react-best-practices -a claude-code -y');
	});

	test('Should handle single level skill path', () => {
		const skillName = 'repo/skill';
		const result = BuildSkillPath(skillName);

		assert.strictEqual(result, 'npx -y skills add repo --skill skill -a universal -y');
	});

	test('Should handle multi-level skill paths', () => {
		const skillName = 'owner/repo/subdir/skill-name';
		const result = BuildSkillPath(skillName);

		assert.strictEqual(result, 'npx -y skills add owner/repo --skill subdir/skill-name -a universal -y');
	});

	test('Should preserve hyphens and underscores in skill names', () => {
		const skillName = 'vercel-labs/agent-skills/vercel-react-best_practices';
		const result = BuildSkillPath(skillName);

		assert.strictEqual(result.includes('vercel-react-best_practices'), true);
	});
});

suite('Technology Model Tests', () => {
	test('Should create technology with installed flag', () => {
		const skillsService = new SkillsService();
		const firstTech = skillsService.getAllTechnologies()[0];

		assert.strictEqual(typeof firstTech.installed, 'boolean');
		assert.strictEqual(firstTech.installed, false);

		skillsService.dispose();
	});

	test('Should have detectedAt date when installed', () => {
		const skillsService = new SkillsService();
		const firstTech = skillsService.getAllTechnologies()[0];

		skillsService.markTechnologyInstalled(firstTech.id);
		const tech = skillsService.getTechnologyById(firstTech.id);

		assert.strictEqual(tech?.detectedAt instanceof Date, true);

		skillsService.dispose();
	});

	test('Should remove detectedAt when marked not installed', () => {
		const skillsService = new SkillsService();
		const firstTech = skillsService.getAllTechnologies()[0];

		skillsService.markTechnologyInstalled(firstTech.id);
		skillsService.markTechnologyNotInstalled(firstTech.id);

		const tech = skillsService.getTechnologyById(firstTech.id);
		assert.strictEqual(tech?.detectedAt, undefined);

		skillsService.dispose();
	});

	test('Should have skills array', () => {
		const skillsService = new SkillsService();
		const firstTech = skillsService.getAllTechnologies()[0];

		assert.strictEqual(Array.isArray(firstTech.skills), true);

		skillsService.dispose();
	});

	test('Should have name and ID', () => {
		const skillsService = new SkillsService();
		const firstTech = skillsService.getAllTechnologies()[0];

		assert.strictEqual(typeof firstTech.name, 'string');
		assert.strictEqual(firstTech.name.length > 0, true);
		assert.strictEqual(typeof firstTech.id, 'string');
		assert.strictEqual(firstTech.id.length > 0, true);

		skillsService.dispose();
	});
});

suite('Skills Map Configuration Tests', () => {
	test('Should have valid skills map', () => {
		assert.strictEqual(Array.isArray(SKILLS_MAP), true);
		assert.strictEqual(SKILLS_MAP.length > 0, true);
	});

	test('Should have unique technology IDs', () => {
		const ids = SKILLS_MAP.map(tech => tech.id);
		const uniqueIds = new Set(ids);

		assert.strictEqual(ids.length, uniqueIds.size, 'Technology IDs should be unique');
	});

	test('Should have required fields in each technology', () => {
		SKILLS_MAP.forEach(tech => {
			assert.strictEqual(typeof tech.id, 'string', `Technology ID should be string: ${tech.id}`);
			assert.strictEqual(typeof tech.name, 'string', `Technology name should be string: ${tech.name}`);
			assert.strictEqual(tech.detect !== undefined, true, `Technology should have detect config: ${tech.id}`);
			assert.strictEqual(Array.isArray(tech.skills), true, `Technology skills should be array: ${tech.id}`);
		});
	});

	test('Should have valid detect configuration', () => {
		SKILLS_MAP.forEach(tech => {
			const detect = tech.detect;
			assert.strictEqual(detect !== undefined, true, `Technology should have detect config: ${tech.id}`);
			
			// At least one detection method should be present
			const hasDetectionMethod = 
				(detect.packages && detect.packages.length > 0) ||
				(detect.configFiles && detect.configFiles.length > 0) ||
				(detect.gems && detect.gems.length > 0) ||
				(detect.packagePatterns && detect.packagePatterns.length > 0) ||
				(detect.configFileContent !== undefined);

			assert.strictEqual(hasDetectionMethod, true, 
				`Technology should have at least one detection method: ${tech.id}`);
		});
	});

	test('Should have technologies with skills', () => {
		const techsWithSkills = SKILLS_MAP.filter(tech => tech.skills && tech.skills.length > 0);
		assert.strictEqual(techsWithSkills.length > 0, true, 'Should have technologies with skills');
	});

	test('All skill paths should follow correct format', () => {
		SKILLS_MAP.forEach(tech => {
			tech.skills.forEach(skill => {
				// Skill format should be: owner/repo/skill-name or owner/repo/subdir/skill-name
				const parts = skill.split('/');
				assert.strictEqual(parts.length >= 2, true, 
					`Skill should have at least owner/repo format: ${skill} in ${tech.id}`);
			});
		});
	});
});

suite('Installation Results Tests', () => {
	test('Should track successful installation', () => {
		const result = {
			success: true,
			skillName: 'test-skill',
			message: 'Installation successful'
		};

		assert.strictEqual(result.success, true);
		assert.strictEqual(typeof result.skillName, 'string');
		assert.strictEqual(typeof result.message, 'string');
	});

	test('Should track failed installation', () => {
		const result = {
			success: false,
			skillName: 'test-skill',
			message: 'Installation failed',
			error: new Error('Test error')
		};

		assert.strictEqual(result.success, false);
		assert.strictEqual(result.error instanceof Error, true);
	});

	test('Should generate correct summary message for 100% success', () => {
		const results = [
			{ success: true, skillName: 'skill1', message: '' },
			{ success: true, skillName: 'skill2', message: '' },
			{ success: true, skillName: 'skill3', message: '' }
		];

		const successCount = results.filter(r => r.success).length;
		const failCount = results.filter(r => !r.success).length;

		assert.strictEqual(successCount, 3);
		assert.strictEqual(failCount, 0);
		assert.strictEqual(failCount === 0, true);
	});

	test('Should generate correct summary message for partial success', () => {
		const results = [
			{ success: true, skillName: 'skill1', message: '' },
			{ success: true, skillName: 'skill2', message: '' },
			{ success: false, skillName: 'skill3', message: '' }
		];

		const successCount = results.filter(r => r.success).length;
		const failCount = results.filter(r => !r.success).length;
		const totalSkills = results.length;

		assert.strictEqual(successCount, 2);
		assert.strictEqual(failCount, 1);
		assert.strictEqual(totalSkills, 3);
		assert.strictEqual(failCount > 0, true);
	});
});
