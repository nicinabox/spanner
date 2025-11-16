export type FormError = ValidationError | string;

export type FormAction = {
	errors?: FormError[];
} | null;

export interface ValidationRules {
	required?: boolean;
}

export interface ValidationError {
	id: string;
	title: string;
}

export function validate<R extends Record<string, ValidationRules>>(formData: FormData, rules: R) {
	const errors: ValidationError[] = [];
	const data = Object.fromEntries(formData) as Record<keyof R, string>;

	for (const [field, rule] of Object.entries(rules)) {
		const value = data[field];

		if (rule.required && !value) {
			errors.push({ id: field, title: `${field} can't be blank` });
		}
	}

	return {
		errors,
		data,
		valid: Object.values(errors).length === 0
	};
}

export function findFieldError(name: string, errors: FormError[] | undefined) {
	return errors?.find((error): error is ValidationError => {
		if (typeof error === 'string') return false;
		return error.id === name;
	})?.title;
}

export function findPlainErrors(errors: FormError[] | undefined) {
	const found = errors?.filter((error) => typeof error === 'string');
	return found?.length ? found : null;
}

export function decode(formData: FormData) {
	const decodeValue = (value: FormDataEntryValue) => {
		if (!value) return '';
		if (value === 'true') return true;
		if (value === 'false') return false;
		if (!isNaN(Number(value))) return Number(value);
		return value;
	};

	const result: Record<string, any> = {};

	for (const [key, value] of formData.entries()) {
		const keys = key.split('.');
		let current = result;

		for (let i = 0; i < keys.length; i++) {
			const part = keys[i];
			if (i === keys.length - 1) {
				current[part] = decodeValue(value);
			} else {
				current[part] = current[part] || {};
				current = current[part];
			}
		}
	}

	return result;
}
