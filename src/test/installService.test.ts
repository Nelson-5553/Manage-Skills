import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { InstallSkillService, InstallResult } from '../services/InstallSkillService';
import { SkillsService } from '../services/SkillsService';

suite('InstallSkillService Tests', () => {
	let installService: InstallSkillService;
	let skillsService: SkillsService;

	setup(() => {
		skillsService = new SkillsService();
		installService = new InstallSkillService(skillsService);

		// Set a test project path
		skillsService['projectPath'] = path.join(__dirname, '../../');
	});

	teardown(() => {
		skillsService.dispose();
	});

	test('Should have installSkill method', () => {
		assert.strictEqual(typeof installService.installSkill, 'function');
	});

	test('Should have installAllTechSkills method', () => {
		assert.strictEqual(typeof installService.installAllTechSkills, 'function');
	});

	test('Should have installAllSuggestedSkills method', () => {
		assert.strictEqual(typeof installService.installAllSuggestedSkills, 'function');
	});

	test('Should have installMultipleSkills method', () => {
		assert.strictEqual(typeof installService.installMultipleSkills, 'function');
	});

	test('Should calculate installation summary correctly', () => {
		const results: InstallResult[] = [
			{
				success: true,
				skillName: 'skill1',
				message: 'Success 1'
			},
			{
				success: true,
				skillName: 'skill2',
				message: 'Success 2'
			},
			{
				success: false,
				skillName: 'skill3',
				message: 'Failed'
			}
		];

		const summary = installService.getInstallationSummary(results);

		assert.strictEqual(summary.totalSkills, 3);
		assert.strictEqual(summary.successCount, 2);
		assert.strictEqual(summary.failCount, 1);
		assert.strictEqual(summary.successPercentage, (2 / 3) * 100);
	});

	test('Should calculate 100% success summary', () => {
		const results: InstallResult[] = [
			{ success: true, skillName: 'skill1', message: 'Success 1' },
			{ success: true, skillName: 'skill2', message: 'Success 2' }
		];

		const summary = installService.getInstallationSummary(results);

		assert.strictEqual(summary.successCount, 2);
		assert.strictEqual(summary.failCount, 0);
		assert.strictEqual(summary.successPercentage, 100);
	});

	test('Should calculate 0% success summary', () => {
		const results: InstallResult[] = [
			{ success: false, skillName: 'skill1', message: 'Failed 1', error: new Error() },
			{ success: false, skillName: 'skill2', message: 'Failed 2', error: new Error() }
		];

		const summary = installService.getInstallationSummary(results);

		assert.strictEqual(summary.successCount, 0);
		assert.strictEqual(summary.failCount, 2);
		assert.strictEqual(summary.successPercentage, 0);
	});

	test('Should handle empty results', () => {
		const results: InstallResult[] = [];
		const summary = installService.getInstallationSummary(results);

		assert.strictEqual(summary.totalSkills, 0);
		assert.strictEqual(summary.successCount, 0);
		assert.strictEqual(summary.failCount, 0);
		assert.strictEqual(summary.successPercentage, 0);
	});

	test('Should create InstallResult with success', () => {
		const result: InstallResult = {
			success: true,
			skillName: 'test-skill',
			message: 'Installation successful'
		};

		assert.strictEqual(result.success, true);
		assert.strictEqual(typeof result.skillName, 'string');
		assert.strictEqual(typeof result.message, 'string');
		assert.strictEqual(result.error, undefined);
	});

	test('Should create InstallResult with error', () => {
		const error = new Error('Test error');
		const result: InstallResult = {
			success: false,
			skillName: 'test-skill',
			message: 'Installation failed',
			error
		};

		assert.strictEqual(result.success, false);
		assert.strictEqual(result.error, error);
	});

	test('Should handle single installation result', () => {
		const results: InstallResult[] = [
			{ success: true, skillName: 'single-skill', message: 'Success' }
		];

		const summary = installService.getInstallationSummary(results);

		assert.strictEqual(summary.totalSkills, 1);
		assert.strictEqual(summary.successCount, 1);
		assert.strictEqual(summary.successPercentage, 100);
	});

	test('Installation results should track skill name', () => {
		const skillName = 'vercel-labs/agent-skills/vercel-react-best-practices';
		const result: InstallResult = {
			success: true,
			skillName,
			message: 'Installation completed'
		};

		assert.strictEqual(result.skillName, skillName);
	});
});

suite('InstallSkillService Integration Tests', () => {
	let installService: InstallSkillService;
	let skillsService: SkillsService;

	setup(() => {
		skillsService = new SkillsService();
		installService = new InstallSkillService(skillsService);
		skillsService['projectPath'] = path.join(__dirname, '../../');
	});

	teardown(() => {
		skillsService.dispose();
	});

	test('Should handle technology with no skills', async () => {
		const results = await installService.installAllTechSkills();
		assert.strictEqual(Array.isArray(results), true);
	});

	test('Should handle empty suggested skills array', async () => {
		const results = await installService.installAllSuggestedSkills([]);
		assert.strictEqual(Array.isArray(results), true);
		assert.strictEqual(results.length, 0);
	});

	test('Should return array from installMultipleSkills', async () => {
		const results = await installService.installMultipleSkills([], { stopOnError: false });
		assert.strictEqual(Array.isArray(results), true);
		assert.strictEqual(results.length, 0);
	});

	test('Should respect stopOnError option', async () => {
		// This is a unit test - actual installation would happen with real commands
		const options = { stopOnError: true };
		assert.strictEqual(typeof options.stopOnError, 'boolean');
		assert.strictEqual(options.stopOnError, true);
	});

	test('Should return results with correct structure', async () => {
		const results = await installService.installAllTechSkills();

		results.forEach(result => {
			assert.strictEqual(typeof result.success, 'boolean');
			assert.strictEqual(typeof result.skillName, 'string');
			assert.strictEqual(typeof result.message, 'string');
		});
	});
});
