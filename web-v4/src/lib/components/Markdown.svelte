<script lang="ts">
	import insane from 'insane';
	import { marked } from 'marked';

	interface Props {
		src: string;
	}

	let { src }: Props = $props();
</script>

<div>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html insane(marked(src, { async: false }))}
</div>
