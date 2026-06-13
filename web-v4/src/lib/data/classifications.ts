import { createAPIRequest, type RequestOpts } from './client';

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

const request = createAPIRequest();

export const getAllClassifications = (opts: RequestOpts) => {
	return request<Classification[]>('/classifications', opts);
};
