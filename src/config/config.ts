/**
 * Global Manage Skills configuration
 */
export const config = {
	// Extension config
	extension: {
		id: 'manage-skills',
		name: 'Manage Skills',
		displayName: 'Manage Skills Extension'
	},

	// Storage config
	storage: {
		skillsStorageKey: 'manage-skills.skills',
		installedSkillsKey: 'manage-skills.installed-skills'
	},

	// Views config
	views: {
		availableSkillsView: 'skillsView',
		installedSkillsView: 'installedSkillsView'
	},

	// Skill categories
	skillCategories: {
		language: 'Lenguajes',
		framework: 'Frameworks',
		tool: 'Herramientas',
		extension: 'Extensiones',
		backend: 'Backend',
		frontend: 'Frontend',
		database: 'Bases de Datos',
		other: 'Otros'
	},

	// Default paths
	paths: {
		resourcesDir: 'resources',
		iconsDir: 'resources/icons'
	}
};
