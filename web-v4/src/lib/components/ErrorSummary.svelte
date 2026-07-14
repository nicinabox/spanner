<script lang="ts">
	import Alert, { type AlertProps } from '$lib/components/common/Alert.svelte';
	import type { FormError } from '$lib/utils/form';

	interface Props extends Omit<AlertProps, 'children'> {
		formErrors: FormError[];
	}

	let { formErrors, ...props }: Props = $props();
</script>

{#if formErrors.length > 0}
	<Alert role="alert" class="mb-4" {...props}>
		{#each formErrors as e}
			<p>{e.title}</p>
		{/each}
	</Alert>
{/if}
