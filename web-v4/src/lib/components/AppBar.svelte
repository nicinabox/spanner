<script lang="ts">
	import { resolve } from '$app/paths';
	import { type Snippet } from 'svelte';
	import { type Session } from '$lib/utils/session';
	import { LogOut } from 'lucide-svelte';

	interface Props {
		start?: Snippet;
		center?: Snippet;
		end?: Snippet;
		session?: Session | null;
		class?: string;
	}

	let { start, center, end, session, class: className }: Props = $props();
</script>

<header class="navbar relative z-10 gap-4 bg-base-200 shadow-sm {className}">
	<div class="navbar-start [grid-area:start]">
		{@render start?.()}
	</div>
	<div class="navbar-center [grid-area:center]">
		{#if center}
			{@render center()}
		{:else}
			<a href={resolve('/')} class="btn text-lg btn-ghost btn-sm">Spanner</a>
		{/if}
	</div>
	<div class="navbar-end [grid-area:end]">
		{#if end}
			{@render end()}
		{:else if session}
			<div class="inline-flex items-center gap-2 text-sm">
				<span>{session?.email.split('@')[0]}</span>
				<a
					href={resolve('/logout')}
					class="btn btn-square btn-ghost btn-sm"
					data-sveltekit-preload-data="tap"
				>
					<LogOut size={16} />
				</a>
			</div>
		{/if}
	</div>
</header>
