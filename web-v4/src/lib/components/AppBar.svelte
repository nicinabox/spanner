<script lang="ts">
	import { resolve } from '$app/paths';
	import { type Snippet } from 'svelte';
	import { LogOut } from 'lucide-svelte';
	import Button from './ui/Button.svelte';
	import type { Session } from '$lib/data/session';

	interface Props {
		start?: Snippet;
		center?: Snippet;
		end?: Snippet;
		session?: Session | null;
		class?: string;
	}

	let { start, center, end, session, class: className }: Props = $props();
</script>

<header class="navbar dark relative z-10 gap-4 bg-primary text-primary-foreground {className}">
	<div class="navbar-start [grid-area:start]">
		{@render start?.()}
	</div>
	<div class="navbar-center [grid-area:center]">
		{#if center}
			{@render center()}
		{:else}
			<a href={resolve('/')}>
				<img src="/logo-white.png" alt="Spanner" class="h-6 w-auto" />
			</a>
		{/if}
	</div>
	<div class="navbar-end ml-auto [grid-area:end]">
		{#if end}
			{@render end()}
		{:else if session}
			<div class="inline-flex items-center gap-2 text-sm">
				<span>{session.email}</span>
				<Button
					href="/logout"
					size="icon-sm"
					class="text-foreground"
					variant="ghost"
					data-sveltekit-preload-data="tap"
				>
					<LogOut size={16} />
				</Button>
			</div>
		{/if}
	</div>
</header>
