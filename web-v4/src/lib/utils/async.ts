export async function safeAsync<T, E extends Error = Error>(
	promise: Promise<T>
): Promise<[T | null, E | null]> {
	try {
		const data = await promise;
		return [data, null];
	} catch (err) {
		const error = err instanceof Error ? err : new Error(String(err));
		return [null, error as E];
	}
}
