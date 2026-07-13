import * as v from 'valibot';

const distanceUnitSchema = v.optional(v.picklist(['mi', 'km', 'nmi']), 'mi');
const booleanPreference = v.optional(v.boolean(), false);

export const vehicleFormSchema = v.object({
	name: v.pipe(v.string('Name is required'), v.minLength(1, 'Name is required')),
	vin: v.optional(v.string(''), ''),
	color: v.optional(v.string(''), ''),
	distanceUnit: distanceUnitSchema,
	'preferences.enableCost': booleanPreference,
	'preferences.sendReminderEmails': booleanPreference,
	'preferences.sendPromptForRecords': booleanPreference,
	'preferences.showMileageAdjustmentRecords': booleanPreference,
});
