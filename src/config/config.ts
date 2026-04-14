/**
 * Configuración global de la extensión Manage Skills
 */
export const config = {
	// Configuración de la extensión
	extension: {
		id: 'manage-skills',
		name: 'Manage Skills',
		displayName: 'Manage Skills Extension'
	},

	// Configuración de almacenamiento
	storage: {
		skillsStorageKey: 'manage-skills.skills',
		installedSkillsKey: 'manage-skills.installed-skills'
	},

	// Configuración de vistas
	views: {
		availableSkillsView: 'skillsView',
		installedSkillsView: 'installedSkillsView'
	},

	// Categorías de skills
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

	// Rutas por defecto
	paths: {
		resourcesDir: 'resources',
		iconsDir: 'resources/icons'
	}
};
