<script lang="ts">
	import { Info } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		data: {
			error?: string;
		};
	}

	let { data }: Props = $props();
</script>

{#if data.error}
	<div class="flex min-h-screen flex-col items-center justify-center p-4">
		<div class="w-full max-w-md rounded-xl border border-muted bg-muted p-8 text-center">
			<div class="mb-4 flex justify-center">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-background">
					<Info class="h-8 w-8 text-muted-foreground" />
				</div>
			</div>

			<h1 class="h3 text-foreground">Sorry, that login didn't work</h1>

			<p class="mb-6 text-muted-foreground">
				This login link may have expired or already been used. Login links are valid for 15 minutes
				and can only be used once.
			</p>

			<div class="flex flex-col gap-3">
				<Button href="/" variant="default" size="lg" class="w-full">
					Try again
				</Button>
			</div>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen flex-col items-center justify-center p-4">
		<div class="text-center">
			<div class="mb-4 flex justify-center">
				<div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
			</div>
			<h1 class="h3 text-foreground">Signing you in...</h1>
			<p class="text-muted-foreground">Please wait while we verify your login link.</p>
		</div>
	</div>
{/if}
