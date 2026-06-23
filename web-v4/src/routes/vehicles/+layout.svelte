<script lang="ts">
	import { AppBar } from '$lib';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<AppBar session={data.session} />

<div class="py-6 px-(--main-padding)">
	<div class="w-full mx-auto">
		{@render children?.()}
	</div>
</div>
