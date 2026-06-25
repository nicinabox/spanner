export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
	const value = bytes / Math.pow(1024, i);
	const decimals = i === 0 ? 0 : i <= 2 ? 1 : 2;
	return `${value.toFixed(decimals)} ${units[i]}`;
}
