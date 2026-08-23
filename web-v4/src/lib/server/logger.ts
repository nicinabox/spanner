const LEVELS = ['error', 'warn', 'info', 'debug'] as const;

type Level = (typeof LEVELS)[number];

const levelIndex = (level: string): number => LEVELS.indexOf(level as Level);

const resolveLevel = (): number => {
	const configured = process.env.LOG_LEVEL?.toLowerCase() ?? '';
	const index = levelIndex(configured);
	return index === -1 ? levelIndex('info') : index;
};

const minLevel = resolveLevel();

type Field = Record<string, unknown> & { error?: unknown };

const serialize = (value: unknown): unknown =>
	value instanceof Error
		? { name: value.name, message: value.message, stack: value.stack }
		: value;

const emit = (level: Level, message: string, fields?: Field) => {
	if (levelIndex(level) > minLevel) return;

	const entry: Record<string, unknown> = {
		ts: new Date().toISOString(),
		level,
		message,
	};
	for (const [key, value] of Object.entries(fields ?? {})) {
		entry[key] = serialize(value);
    }

    if (entry.error && typeof entry.error === 'object' && 'message' in entry.error) {
        entry.message ??= entry.error.message;
    }

	console[level](JSON.stringify(entry));
};

export const logger = {
	error: (msg: string, fields?: Field) => emit('error', msg, fields),
	warn: (msg: string, fields?: Field) => emit('warn', msg, fields),
	info: (msg: string, fields?: Field) => emit('info', msg, fields),
	debug: (msg: string, fields?: Field) => emit('debug', msg, fields),
};
