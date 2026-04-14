/**
 * Utilidades comunes para la extensión
 */

/**
 * Valida si un ID de skill es válido
 */
export function isValidSkillId(id: string): boolean {
	return /^[a-z0-9\-_]+$/.test(id) && id.length > 0;
}

/**
 * Formatea un nombre de categoría para mostrar
 */
export function formatCategoryName(category: string): string {
	return category
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * Obtiene el ícono de estado basado en si está instalado
 */
export function getStatusIcon(installed: boolean): string {
	return installed ? '✓' : '○';
}

/**
 * Valida una URL
 */
export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

/**
 * Trunca un string a una longitud máxima
 */
export function truncateString(str: string, maxLength: number): string {
	if (str.length <= maxLength) {
		return str;
	}
	return str.substring(0, maxLength - 3) + '...';
}
