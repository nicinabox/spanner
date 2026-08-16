import { booleanSchema } from '$lib/schemas';
import * as v from 'valibot';

const distanceUnitSchema = v.picklist(['mi', 'km', 'hr', 'nmi']);

const preferencesSchema = v.object({
	enableCost: booleanSchema,
	sendReminderEmails: booleanSchema,
	sendPromptForRecords: booleanSchema,
	showMileageAdjustmentRecords: booleanSchema,
});

export const vehicleFormSchema = v.object({
	name: v.pipe(v.string('Name is required'), v.minLength(1, 'Name is required')),
	vin: v.optional(v.string(''), ''),
	color: v.optional(v.string(''), ''),
	distanceUnit: v.optional(distanceUnitSchema, 'mi'),
	preferences: preferencesSchema,
});
