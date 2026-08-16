<script lang="ts">
	import { version } from '$app/env';
	import { PUBLIC_CONTACT_EMAIL } from '$app/env/public';
	import Badge from './common/Badge.svelte';
</script>

<footer
	class="flex flex-wrap items-center justify-end gap-6 text-sm py-4 px-(--main-padding) mt-auto"
	style="padding-bottom: calc(1rem + env(safe-area-inset-bottom))"
>
	{#if PUBLIC_CONTACT_EMAIL}
		<a href="/legal" class="underline">Legal</a>
	{/if}

	<a href="/docs" class="underline">Docs</a>

	<a href="/colophon" class="underline">Colophon</a>

	<span class="text-ink-500">
		Built with 🧡 by <a
			href="https://nicinabox.com"
			target="_blank"
			class="underline not-hover:text-current">@nicinabox</a
		>
	</span>

	<Badge>{version}</Badge>
</footer>
