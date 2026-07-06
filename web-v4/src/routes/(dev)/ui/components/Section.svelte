<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		children?: Snippet;
	};

	let { title, children }: Props = $props();
</script>

<section>
	<h1 class="text-3xl mb-4 font-bold">{title}</h1>
	{@render children?.()}
</section>
