<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Field, Input, PageLayout } from '$lib';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let success = $derived(form?.success);
	let newEmail = $derived(form?.email ?? '');
</script>

<PageLayout>
	<div class="max-w-xl mx-auto">
		<h1 class="text-2xl font-semibold mb-6">Settings</h1>

		<Card variant="outline" bleed heading="Change email">
			<div>
				<label for="">Current</label>
				<p>
					{data.email}
				</p>
			</div>

			{#if success}
				<div class="bg-positive/10 text-positive rounded-md p-4">
					Confirmation emails sent to <strong>{newEmail}</strong> and <strong>{data.email}</strong>.
					Click the link in either email to confirm the change.
				</div>
			{:else}
				<form method="post" action="?/changeEmail" use:enhance>
					<fieldset class="fieldset">
						<Field
							name="email"
							label="New email"
							hint="We'll send confirmation links to both your current and new address."
							errors={form?.errors}
							required
						>
							<Input name="email" type="email" autocomplete="email" required />
						</Field>
					</fieldset>

					<div class="mt-2">
						<Button type="submit">Update email</Button>
					</div>
				</form>
			{/if}
		</Card>
	</div>
</PageLayout>
