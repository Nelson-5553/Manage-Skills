import * as assert from 'assert';
import * as vscode from 'vscode';
import { AvailableSkillsProvider } from '../providers/AvailableSkillsProvider';
import { SuggestedSkillsProvider } from '../providers/SuggestedSkillsProvider';
import { SkillsService } from '../services/SkillsService';
import { TechnologyTreeItem, SkillItemTreeItem } from '../providers/BaseSkillTreeProvider';
import { Technology } from '../models/Technology';

suite('AvailableSkillsProvider Tests', () => {
	let provider: AvailableSkillsProvider;
	let skillsService: SkillsService;
	let extensionUri: vscode.Uri;

	setup(() => {
		skillsService = new SkillsService();
		extensionUri = vscode.Uri.file('/test');
		provider = new AvailableSkillsProvider(
			skillsService.getAvailableTechnologies(),
			extensionUri
		);
	});

	teardown(() => {
		skillsService.dispose();
		provider.dispose();
	});

	test('Should be defined', () => {
		assert.notStrictEqual(provider, undefined);
	});

	test('Should implement TreeDataProvider', () => {
		assert.strictEqual(typeof provider.getChildren, 'function');
		assert.strictEqual(typeof provider.getTreeItem, 'function');
	});

	test('Should get children for root element', async () => {
		const children = await provider.getChildren();
		assert.strictEqual(Array.isArray(children), true);
	});

	test('Should return TechnologyTreeItem for root children', async () => {
		const children = await provider.getChildren();

		if (children.length > 0) {
			const firstChild = children[0];
			assert.strictEqual(firstChild instanceof TechnologyTreeItem, true);
		}
	});

	test('Should get skills for technology', async () => {
		const children = await provider.getChildren();

		if (children.length > 0) {
			const techItem = children[0];
			const skills = await provider.getChildren(techItem);

			skills.forEach(skill => {
				assert.strictEqual(skill instanceof SkillItemTreeItem, true);
			});
		}
	});

	test('Should return empty array for skill items', async () => {
		const children = await provider.getChildren();

		if (children.length > 0) {
			const techItem = children[0];
			const skills = await provider.getChildren(techItem);

			if (skills.length > 0) {
				const skillItem = skills[0];
				const subChildren = await provider.getChildren(skillItem);
				assert.strictEqual(subChildren.length, 0);
			}
		}
	});

	test('Should search technologies', () => {
		const results = provider.searchTechnologies('react');
		assert.strictEqual(Array.isArray(results), true);
	});

	test('Should return TechnologyTreeItem from search', () => {
		const results = provider.searchTechnologies('react');

		if (results.length > 0) {
			results.forEach(item => {
				assert.strictEqual(item instanceof TechnologyTreeItem, true);
			});
		}
	});

	test('Should get available count', () => {
		const count = provider.getAvailableCount();
		assert.strictEqual(typeof count, 'number');
		assert.strictEqual(count >= 0, true);
	});

	test('Should have onDidChangeTreeData event', () => {
		assert.strictEqual(provider.onDidChangeTreeData !== undefined, true);
	});

	test('Should be able to refresh', () => {
		assert.doesNotThrow(() => {
			provider.refresh();
		});
	});

	test('Should be able to update technologies', async () => {
		const newTechs = skillsService.getAvailableTechnologies();
		assert.doesNotThrow(() => {
			provider.updateTechnologies(newTechs);
		});
	});

	test('Should handle empty search results', () => {
		const results = provider.searchTechnologies('xyz-nonexistent-xyz');
		assert.strictEqual(results.length, 0);
	});

	test('Technology items should be collapsed by default', async () => {
		const children = await provider.getChildren();

		if (children.length > 0) {
			const techItem = children[0];
			assert.strictEqual(
				techItem.collapsibleState,
				vscode.TreeItemCollapsibleState.Collapsed
			);
		}
	});
});

suite('SuggestedSkillsProvider Tests', () => {
	let provider: SuggestedSkillsProvider;
	let skillsService: SkillsService;
	let extensionUri: vscode.Uri;

	setup(() => {
		skillsService = new SkillsService();
		extensionUri = vscode.Uri.file('/test');
		provider = new SuggestedSkillsProvider(
			skillsService.getAvailableTechnologies(),
			extensionUri
		);
	});

	teardown(() => {
		skillsService.dispose();
		provider.dispose();
	});

	test('Should be defined', () => {
		assert.notStrictEqual(provider, undefined);
	});

	test('Should implement TreeDataProvider', () => {
		assert.strictEqual(typeof provider.getChildren, 'function');
		assert.strictEqual(typeof provider.getTreeItem, 'function');
	});

	test('Should get children for root element', async () => {
		const children = await provider.getChildren();
		assert.strictEqual(Array.isArray(children), true);
	});

	test('Should have onDidChangeTreeData event', () => {
		assert.strictEqual(provider.onDidChangeTreeData !== undefined, true);
	});

	test('Should be able to refresh', () => {
		assert.doesNotThrow(() => {
			provider.refresh();
		});
	});

	test('Should be able to update technologies', async () => {
		const newTechs = skillsService.getAvailableTechnologies();
		assert.doesNotThrow(() => {
			provider.updateTechnologies(newTechs);
		});
	});
});

suite('TreeItem Tests', () => {
	let extensionUri: vscode.Uri;

	setup(() => {
		extensionUri = vscode.Uri.file('/test');
	});

	test('Should create TechnologyTreeItem', () => {
		const tech: Technology = {
			id: 'test-tech',
			name: 'Test Technology',
			detect: { packages: ['test'] },
			skills: ['test-skill'],
			installed: false
		};

		const item = new TechnologyTreeItem(tech, extensionUri);

		assert.strictEqual(item.label, 'Test Technology');
		assert.strictEqual(item.technology.id, 'test-tech');
	});

	test('TechnologyTreeItem should be collapsible', () => {
		const tech: Technology = {
			id: 'test-tech',
			name: 'Test Technology',
			detect: { packages: ['test'] },
			skills: ['test-skill'],
			installed: false
		};

		const item = new TechnologyTreeItem(tech, extensionUri);

		assert.strictEqual(
			item.collapsibleState,
			vscode.TreeItemCollapsibleState.Collapsed
		);
	});

	test('TechnologyTreeItem with no skills should not be collapsible', () => {
		const tech: Technology = {
			id: 'test-tech',
			name: 'Test Technology',
			detect: { packages: ['test'] },
			skills: [],
			installed: false
		};

		const item = new TechnologyTreeItem(tech, extensionUri);

		assert.strictEqual(
			item.collapsibleState,
			vscode.TreeItemCollapsibleState.None
		);
	});

	test('Should create SkillItemTreeItem', () => {
		const item = new SkillItemTreeItem('test-skill', 'test-tech');

		assert.strictEqual(item.label, 'test-skill');
		assert.strictEqual(item.skillName, 'test-skill');
		assert.strictEqual(item.technologyId, 'test-tech');
	});

	test('SkillItemTreeItem should not be collapsible', () => {
		const item = new SkillItemTreeItem('test-skill', 'test-tech');

		assert.strictEqual(
			item.collapsibleState,
			vscode.TreeItemCollapsibleState.None
		);
	});

	test('TechnologyTreeItem should have description', () => {
		const tech: Technology = {
			id: 'test-tech',
			name: 'Test Technology',
			detect: { packages: ['test'] },
			skills: ['skill1', 'skill2', 'skill3'],
			installed: false
		};

		const item = new TechnologyTreeItem(tech, extensionUri);

		assert.strictEqual(item.description, '3 skills');
	});

	test('TechnologyTreeItem should have buttons', () => {
		const tech: Technology = {
			id: 'test-tech',
			name: 'Test Technology',
			detect: { packages: ['test'] },
			skills: ['test-skill'],
			installed: false
		};

		const item = new TechnologyTreeItem(tech, extensionUri);

		assert.strictEqual(item.buttons !== undefined, true);
		assert.strictEqual(Array.isArray(item.buttons), true);
		assert.strictEqual(item.buttons!.length > 0, true);
	});

	test('TechnologyTreeItem context value for available technology', () => {
		const tech: Technology = {
			id: 'test-tech',
			name: 'Test Technology',
			detect: { packages: ['test'] },
			skills: ['test-skill'],
			installed: false
		};

		const item = new TechnologyTreeItem(tech, extensionUri);

		assert.strictEqual(item.contextValue, 'available-technology');
	});

	test('TechnologyTreeItem context value for installed technology', () => {
		const tech: Technology = {
			id: 'test-tech',
			name: 'Test Technology',
			detect: { packages: ['test'] },
			skills: ['test-skill'],
			installed: true
		};

		const item = new TechnologyTreeItem(tech, extensionUri);

		assert.strictEqual(item.contextValue, 'installed-technology');
	});
});

suite('Activity Bar Integration Tests', () => {
	let skillsService: SkillsService;
	let extensionUri: vscode.Uri;

	setup(() => {
		skillsService = new SkillsService();
		extensionUri = vscode.Uri.file('/test');
	});

	teardown(() => {
		skillsService.dispose();
	});

	test('Should create AvailableSkillsProvider for activity bar', () => {
		const provider = new AvailableSkillsProvider(
			skillsService.getAvailableTechnologies(),
			extensionUri
		);

		assert.notStrictEqual(provider, undefined);
		provider.dispose();
	});

	test('Should create SuggestedSkillsProvider for activity bar', () => {
		const provider = new SuggestedSkillsProvider(
			skillsService.getAvailableTechnologies(),
			extensionUri
		);

		assert.notStrictEqual(provider, undefined);
		provider.dispose();
	});

	test('Should display technologies in tree view', async () => {
		const provider = new AvailableSkillsProvider(
			skillsService.getAvailableTechnologies(),
			extensionUri
		);

		const children = await provider.getChildren();
		assert.strictEqual(children.length > 0, true);

		provider.dispose();
	});

	test('Should display skills under technology', async () => {
		const techs = skillsService.getAvailableTechnologies()
			.filter(t => t.skills && t.skills.length > 0);

		if (techs.length > 0) {
			const provider = new AvailableSkillsProvider(techs, extensionUri);
			const children = await provider.getChildren();

			if (children.length > 0) {
				const techItem = children[0];
				const skills = await provider.getChildren(techItem);
				assert.strictEqual(skills.length > 0, true);
			}

			provider.dispose();
		}
	});
});
