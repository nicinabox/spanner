import { getContext, setContext } from 'svelte';
import type { Snippet } from 'svelte';

const KEY = {};

export type AppBarSlots = {
	start: Snippet | undefined;
	center: Snippet | undefined;
	end: Snippet | undefined;
};

export type AppBarSetters = {
	setStart: (v: Snippet | undefined) => void;
	setCenter: (v: Snippet | undefined) => void;
	setEnd: (v: Snippet | undefined) => void;
};

export function createAppBarSlots() {
	let slots = $state<AppBarSlots>({ start: undefined, center: undefined, end: undefined });

	setContext(KEY, {
		setStart: (v: Snippet | undefined) => slots.start = v,
		setCenter: (v: Snippet | undefined) => slots.center = v,
		setEnd: (v: Snippet | undefined) => slots.end = v,
	} satisfies AppBarSetters);

	return slots;
}

export function useAppBarSetters() {
	return getContext<AppBarSetters>(KEY);
}
