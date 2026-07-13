import * as v from 'valibot';
import { booleanForm } from '$lib/schemas/forms';

const distanceUnitSchema = v.optional(v.picklist(['mi', 'km', 'nmi']), 'mi');

const preferencesSchema = v.object({
	enableCost: booleanForm,
	sendReminderEmails: booleanForm,
	sendPromptForRecords: booleanForm,
	showMileageAdjustmentRecords: booleanForm,
});

export const vehicleFormSchema = v.object({
	name: v.pipe(v.string('Name is required'), v.minLength(1, 'Name is required')),
	vin: v.optional(v.string(''), ''),
	color: v.optional(v.string(''), ''),
	distanceUnit: distanceUnitSchema,
	preferences: preferencesSchema,
});
