/**
 * Common utilities
 */

/**
 * Validates skill ID format
 */
export function isValidSkillId(id: string): boolean {
	return /^[a-z0-9\-_]+$/.test(id) && id.length > 0;
}

/**
 * Formats category name for display
 */
export function formatCategoryName(category: string): string {
	return category
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * Gets status icon
 */
export function getStatusIcon(installed: boolean): string {
	return installed ? '✓' : '○';
}

/**
 * Validates URL
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
 * Truncates string to max length
 */
export function truncateString(str: string, maxLength: number): string {
	if (str.length <= maxLength) {
		return str;
	}
	return str.substring(0, maxLength - 3) + '...';
}
