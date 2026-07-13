import * as v from 'valibot';
import { booleanForm } from '$lib/schemas/forms';

const distanceUnitSchema = v.optional(v.picklist(['mi', 'km', 'nmi']), 'mi');

export const vehicleFormSchema = v.object({
	name: v.pipe(v.string('Name is required'), v.minLength(1, 'Name is required')),
	vin: v.optional(v.string(''), ''),
	color: v.optional(v.string(''), ''),
	distanceUnit: distanceUnitSchema,
	'preferences.enableCost': booleanForm,
	'preferences.sendReminderEmails': booleanForm,
	'preferences.sendPromptForRecords': booleanForm,
	'preferences.showMileageAdjustmentRecords': booleanForm,
});
