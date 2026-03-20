import { getContext, hasContext, setContext } from 'svelte';

export type FieldContext = {
	name: string;
	id?: string;
	value?: unknown;
	required?: boolean;
	invalid?: boolean;
	disabled?: boolean;
	readonly?: boolean;
};

const fieldKey = Symbol('field');

export const setFieldContext = (field: FieldContext) => setContext(fieldKey, field);
export const hasFieldContext = (): boolean => hasContext(fieldKey);
export const getFieldContext = () => {
	return getContext<FieldContext | undefined>(fieldKey);
};
