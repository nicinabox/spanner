<script lang="ts">
	import { AppBar } from '$lib';
	import { createAppBarSlots } from '$lib/stores/appbar.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	let slots = createAppBarSlots();
</script>

<AppBar session={data.session} start={slots.start} center={slots.center} end={slots.end}>
</AppBar>

<div class="py-6 px-(--main-padding)">
	<div class="w-full mx-auto">
		{@render children?.()}
	</div>
</div>
