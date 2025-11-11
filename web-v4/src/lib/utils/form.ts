export type FormAction = { errors?: (ValidationError | string)[] } | null;

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

export function findFieldError(name: string, form: FormAction) {
	if (!form || !('errors' in form)) return null;
	return form.errors.find((error): error is ValidationError => {
		if (typeof error === 'string') return false;
		return error.id === name;
	})?.title;
}

export function findPlainErrors(form: FormAction) {
	if (!form || !('errors' in form)) return null;
	const errors = form.errors.filter((error) => typeof error === 'string');
	return errors.length > 0 ? errors : null;
}
