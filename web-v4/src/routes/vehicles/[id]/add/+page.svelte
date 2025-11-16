<script lang="ts">
	import RecordForm from '$lib/components/forms/RecordForm.svelte';
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import type { HistoryEntry } from '$lib/data/history';

	let { form, data }: PageProps = $props();
	let paramValues = Object.fromEntries(page.url.searchParams) as Partial<HistoryEntry>;
</script>

<div class="container mx-auto max-w-xl">
	<RecordForm {form} vehicle={data.vehicle} values={paramValues} />
</div>
