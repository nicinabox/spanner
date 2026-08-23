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

const serializeError = (value: any) => {
	if (value instanceof Error) {
		return { name: value.name, message: value.message };
	}
	return value;
};

const emit = (level: Level, value: unknown, fields?: Field) => {
	if (levelIndex(level) > minLevel) return;

	const messageFields = value instanceof Error ? serializeError(value) : { message: value };
	const errorFields = fields?.error ? { error: serializeError(fields?.error) } : {};

	const entry: Record<string, unknown> = {
		ts: new Date().toISOString(),
		level,
		...messageFields,
		...fields,
		...errorFields,
	};

	console[level](JSON.stringify(entry));
};

export const logger = {
	error: (val: unknown, fields?: Field) => emit('error', val, fields),
	warn: (val: unknown, fields?: Field) => emit('warn', val, fields),
	info: (val: unknown, fields?: Field) => emit('info', val, fields),
	debug: (val: unknown, fields?: Field) => emit('debug', val, fields),
};
