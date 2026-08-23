const LEVELS = ['error', 'warn', 'info', 'debug'] as const;

type Level = (typeof LEVELS)[number];

const levelIndex = (level: string): number => LEVELS.indexOf(level as Level);

const resolveLevel = (): number => {
	const configured = process.env.LOG_LEVEL?.toLowerCase() ?? '';
	const index = levelIndex(configured);
	return index === -1 ? levelIndex('info') : index;
};

const minLevel = resolveLevel();

type Field = Record<string, unknown>;

/**
 * Errors can't be JSON.stringify'd into anything useful, so normalize any
 * `Error` value into a plain object here rather than in every caller.
 */
const serialize = (value: unknown): unknown =>
	value instanceof Error
		? { name: value.name, message: value.message, stack: value.stack }
		: value;

const emit = (level: Level, msg: string, fields?: Field) => {
	if (levelIndex(level) > minLevel) return;

	const entry: Record<string, unknown> = {
		ts: new Date().toISOString(),
		level,
		msg,
	};
	for (const [key, value] of Object.entries(fields ?? {})) {
		entry[key] = serialize(value);
	}

	console[level](JSON.stringify(entry));
};

export const logger = {
	error: (msg: string, fields?: Field) => emit('error', msg, fields),
	warn: (msg: string, fields?: Field) => emit('warn', msg, fields),
	info: (msg: string, fields?: Field) => emit('info', msg, fields),
	debug: (msg: string, fields?: Field) => emit('debug', msg, fields),
};
