<script lang="ts">
	import { page } from '$app/state';
	import AppBar from './AppBar.svelte';
	import AppFooter from './AppFooter.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		appbarStart?: Snippet;
		appbarCenter?: Snippet;
		appbarEnd?: Snippet;
		appbarClass?: string;
		sidebar?: Snippet;
		children: Snippet;
	}

	let {
		appbarStart: start,
		appbarCenter: center,
		appbarEnd: end,
		appbarClass,
		sidebar,
		children,
	}: Props = $props();

	let session = $derived(page.data.session);
</script>

<AppBar {session} {start} {center} {end} class={appbarClass} />

<div class="min-h-[calc(100dvh-var(--appbar-height))] flex flex-col">
	{#if sidebar}
		<div class="flex-1 flex">
			<aside
				class={[
					'hidden bg-brand-100 dark:bg-ink-50 overscroll-contain',
					'lg:block lg:w-72 lg:shrink-0 lg:sticky lg:top-(--appbar-height) lg:self-start lg:max-h-[calc(100dvh-var(--appbar-height))] lg:overflow-y-auto lg:border-r lg:border-brand-200 lg:pt-12 lg:px-8',
				]}
			>
				{@render sidebar()}
			</aside>

			<div class="flex-1 min-w-0 flex flex-col">
				<div class="flex-1 px-(--main-padding) lg:px-12 py-12">
					{@render children()}
				</div>
				<AppFooter />
			</div>
		</div>
	{:else}
		<div class="flex-1 px-(--main-padding) py-6">
			<div class="w-full mx-auto">
				{@render children()}
			</div>
		</div>
		<AppFooter />
	{/if}
</div>
