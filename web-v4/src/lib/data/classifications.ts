import { request } from './server';
import type { RequestOpts } from './types';

export interface Classification {
	id: number;
	key: string;
	name: string;
	description: string | null;
	system: boolean;
	defaultMileageInterval: number | null;
	defaultMonthInterval: number | null;
	createdAt: string;
	updatedAt: string;
}

export const getAllClassifications = (opts: RequestOpts) => {
	return request<Classification[]>('/classifications', opts);
};
