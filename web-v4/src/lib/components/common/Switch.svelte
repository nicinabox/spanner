<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const switchControlVariants = tv({
		base: 'inline-flex items-center shrink-0 rounded-full transition-colors duration-150 ease-out-expo cursor-pointer data-disabled:cursor-not-allowed data-disabled:opacity-50',
		variants: {
			size: {
				sm: 'w-8 h-4 p-0.5',
				md: 'w-10 h-5 p-0.5',
				lg: 'w-12 h-6 p-0.5'
			},
			state: {
				checked: 'bg-positive',
				unchecked: 'bg-ink-200'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	});

	export const switchThumbVariants = tv({
		base: 'rounded-full bg-white shadow-sm transition-transform duration-150 ease-out-expo data-disabled:shadow-none',
		variants: {
			size: {
				sm: 'w-3 h-3 data-[state=checked]:translate-x-4',
				md: 'w-4 h-4 data-[state=checked]:translate-x-5',
				lg: 'w-5 h-5 data-[state=checked]:translate-x-6'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	});
</script>

<script lang="ts">
	import * as zagSwitch from '@zag-js/switch';
	import { useMachine, normalizeProps } from '@zag-js/svelte';
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		name?: string;
		checked?: boolean;
		defaultChecked?: boolean;
		onCheckedChange?: (details: { checked: boolean }) => void;
		disabled?: boolean;
		required?: boolean;
		invalid?: boolean;
		readOnly?: boolean;
		value?: string;
		label?: string;
		id?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: ClassValue;
		children?: Snippet;
	};

	let {
		name: fieldName,
		checked: controlledChecked,
		defaultChecked,
		onCheckedChange,
		disabled,
		required,
		invalid,
		readOnly,
		value = 'on',
		label,
		id: idProp,
		size = 'md',
		class: className,
		children
	}: Props = $props();

	let id = $props.id();
	let resolvedId = $derived(idProp ?? id);

	const service = useMachine(zagSwitch.machine, {
		id: resolvedId,
		name: fieldName,
		disabled,
		required,
		invalid,
		readOnly,
		value,
		checked: controlledChecked,
		defaultChecked,
		onCheckedChange
	});

	const api = $derived(zagSwitch.connect(service, normalizeProps));

	let controlClass = $derived(
		cn(
			switchControlVariants({
				size,
				state: api.checked ? 'checked' : 'unchecked'
			})
		)
	);

	let thumbClass = $derived(
		cn(switchThumbVariants({ size }))
	);
</script>

<label {...api.getRootProps()} class={cn('inline-flex items-center gap-2', className)}>
	<input {...api.getHiddenInputProps()} />
	<span {...api.getControlProps()} class={controlClass}>
		<span {...api.getThumbProps()} class={thumbClass}></span>
	</span>
	{#if children}
		{@render children()}
	{:else if label}
		<span {...api.getLabelProps()} class="text-sm font-medium text-ink-900 select-none data-disabled:opacity-50">
			{label}
		</span>
	{/if}
</label>
