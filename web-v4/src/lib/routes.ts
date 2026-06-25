export function vehiclePath(id: number, ...segments: string[]) {
	return [`/vehicles/${id}`, ...segments].filter(Boolean).join('/');
}
