<script>
	import { Button, Field, Input } from '$lib';
</script>

<main class="container max-w-lg py-6">
	<section>
		<h2>Button</h2>

		<div>
			<h3>Variants</h3>
			<Button variant="primary">Next</Button>
			<Button variant="secondary">Next</Button>
			<Button variant="tertiary">Next</Button>
			<Button variant="neutral">Next</Button>
			<Button disabled>Next</Button>
		</div>

		<div>
			<h3>Radius</h3>
			<Button size="sm" radius="pill">Next</Button>
			<Button radius="pill">Next</Button>
			<Button size="lg" radius="pill">Next</Button>
		</div>

		<div>
			<h3>Sizes</h3>
			<Button variant="primary" size="sm">Next</Button>
			<Button variant="primary">Next</Button>
			<Button variant="primary" size="lg">Next</Button>
		</div>
	</section>

	<section>
		<h2>Form</h2>

		<div>
			<h3>Within Field (auto-connected)</h3>
			<Field name="name" label="Name">
				<Input />
			</Field>

			<Field name="email" label="Email" hint="We'll never share your email." required>
				<Input type="email" />
			</Field>

			<Field name="token" label="Token" errors={[{ id: 'token', title: "Token can't be blank" }]}>
				<Input autocomplete="off" />
			</Field>
		</div>

		<div>
			<h3>Sizes</h3>
			<Input size="sm" name="sm" placeholder="Small" />
			<Input name="md" placeholder="Medium (default)" />
			<Input size="lg" name="lg" placeholder="Large" />
		</div>

		<div>
			<h3>Standalone</h3>
			<Input name="search" type="search" placeholder="Search..." />
		</div>
	</section>
</main>

<style>
	section {
		display: flex;
		flex-direction: column;
		margin-block: var(--space-8);

		h2 {
			font-weight: bold;
			margin-bottom: var(--space-3);
		}

		h3 {
			margin-top: var(--space-3);
			margin-bottom: var(--space-2);
		}
	}
</style>
