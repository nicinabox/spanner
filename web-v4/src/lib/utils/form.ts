interface ValidationRules {
	required?: boolean;
}

export function validate<R extends Record<string, ValidationRules>>(formData: FormData, rules: R) {
	const errors: Record<string, string> = {};
	const data = Object.fromEntries(formData) as Record<keyof R, string>;

	for (const [field, rule] of Object.entries(rules)) {
		const value = data[field];

		if (rule.required && !value) {
			errors[field] = `${field} is required`;
		}
	}

	return {
		errors,
		data,
		valid: Object.values(errors).length === 0
	};
}
