<script lang="ts">
	import { AppBar } from '$lib';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<AppBar session={data.session} />

<div class="main">
	<div class="container">
		{@render children?.()}
	</div>
</div>