export async function safeAsync<T>(promise: Promise<T>): Promise<[T | null, Error | null]> {
	try {
		const data = await promise;
		return [data, null];
	} catch (error) {
		return [null, error instanceof Error ? error : new Error(String(error))];
	}
}
