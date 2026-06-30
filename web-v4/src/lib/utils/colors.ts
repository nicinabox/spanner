type Palette = Record<number, string>;

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const sanitized = hex.replace(/#+/g, '#');
	const parts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(sanitized);
	if (!parts) return null;
	return {
		r: parseInt(parts[1], 16),
		g: parseInt(parts[2], 16),
		b: parseInt(parts[3], 16),
	};
}

function rgbToHex(r: number, g: number, b: number): string {
	const toHex = (c: number) => `${c.toString(16).padStart(2, '0')}`;
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lighten(hex: string, intensity: number): string {
	const color = hexToRgb(hex);
	if (!color) return '';
	const r = Math.round(color.r + (255 - color.r) * intensity);
	const g = Math.round(color.g + (255 - color.g) * intensity);
	const b = Math.round(color.b + (255 - color.b) * intensity);
	return rgbToHex(r, g, b);
}

function darken(hex: string, intensity: number): string {
	const color = hexToRgb(hex);
	if (!color) return '';
	const r = Math.round(color.r * intensity);
	const g = Math.round(color.g * intensity);
	const b = Math.round(color.b * intensity);
	return rgbToHex(r, g, b);
}

export function getColorPalette(baseColor: string): Palette {
	const palette: Palette = { 500: `#${baseColor}`.replace('##', '#') };

	const intensityMap: Record<number, number> = {
		50: 0.95,
		100: 0.9,
		200: 0.75,
		300: 0.6,
		400: 0.3,
		600: 0.9,
		700: 0.75,
		800: 0.6,
		900: 0.49,
	};

	[50, 100, 200, 300, 400].forEach((level) => {
		palette[level] = lighten(baseColor, intensityMap[level]);
	});

	[600, 700, 800, 900].forEach((level) => {
		palette[level] = darken(baseColor, intensityMap[level]);
	});

	return palette;
}
