<script lang="ts">
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();
</script>

<h1 class="h1">Vehicles</h1>

<ul class="list">
	{#each data.vehicles as v (v.id)}
		<li>
			<a href={resolve(`/vehicles/${v.id}`)} class="block py-2">
				{v.name}
			</a>
			{#if v !== data.vehicles.at(-1)}
				<div role="separator" class="divider-px divider"></div>
			{/if}
		</li>
	{/each}
</ul>
