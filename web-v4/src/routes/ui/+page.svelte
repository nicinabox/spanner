<script>
	import { Button, Field, Input } from '$lib';
</script>

<main class="w-full mx-auto max-w-lg py-6">
	<section>
		<h2>Button</h2>

		<div>
			<h3>Variants</h3>
			<Button variant="solid">Next</Button>
			<Button variant="outline">Next</Button>
			<Button variant="ghost">Next</Button>
			<Button color="neutral">Next</Button>
			<Button disabled>Next</Button>
		</div>

		<div>
			<h3>Colors</h3>
			<div>
				<h4>Solid</h4>
				<Button color="brand">Brand</Button>
				<Button color="neutral">Neutral</Button>
			</div>
			<div>
				<h4>Outline</h4>
				<Button variant="outline" color="brand">Brand</Button>
				<Button variant="outline" color="neutral">Neutral</Button>
			</div>
			<div>
				<h4>Ghost</h4>
				<Button variant="ghost" color="brand">Brand</Button>
				<Button variant="ghost" color="neutral">Neutral</Button>
			</div>
		</div>

		<div>
			<h3>Radius</h3>
			<Button size="sm" radius="pill">Next</Button>
			<Button radius="pill">Next</Button>
			<Button size="lg" radius="pill">Next</Button>
		</div>

		<div>
			<h3>Sizes</h3>
			<Button variant="solid" size="sm">Next</Button>
			<Button variant="solid">Next</Button>
			<Button variant="solid" size="lg">Next</Button>
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
		margin-block: 2rem;

		h2 {
			font-weight: bold;
			margin-bottom: 0.75rem;
		}

		h3 {
			margin-top: 0.75rem;
			margin-bottom: 0.5rem;
		}
	}
</style>
