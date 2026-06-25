<script>
	import { Button, Clipboard, Field, Input, InputGroup, PageLayout } from '$lib';
	import { Mail, Search } from 'lucide-svelte';
</script>

<PageLayout>
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
			<Button size="xs" pill>Next</Button>
			<Button size="sm" pill>Next</Button>
			<Button size="md" pill>Next</Button>
			<Button size="lg" pill>Next</Button>
		</div>

		<div>
			<h3>Sizes</h3>
			<Button variant="solid" size="xs">Next</Button>
			<Button variant="solid" size="sm">Next</Button>
			<Button variant="solid" size="md">Next</Button>
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
			<h3>Variants</h3>
			<Input name="outline" placeholder="Outline (default)" />
			<Input variant="filled" name="filled" placeholder="Filled" />
		</div>

		<div>
			<h3>Addons</h3>
			<InputGroup name="start" placeholder="With start">
				{#snippet startAddon()}${/snippet}
			</InputGroup>
			<InputGroup name="end" placeholder="With end">
				{#snippet endAddon()}kg{/snippet}
			</InputGroup>
			<InputGroup name="both" placeholder="With both">
				{#snippet startAddon()}https://{/snippet}
				{#snippet endAddon()}.com{/snippet}
			</InputGroup>
		</div>

		<div>
			<h3>Inline</h3>
			<InputGroup name="inline-start" placeholder="Search...">
				{#snippet start()}<Search size={16} />{/snippet}
			</InputGroup>
			<InputGroup name="inline-end" placeholder="Email">
				{#snippet end()}<Mail size={16} />{/snippet}
			</InputGroup>
		</div>

		<div>
			<h3>Standalone</h3>
			<Input name="search" type="search" placeholder="Search..." />
		</div>
	</section>

	<section>
		<h2>Clipboard</h2>
		<div>
			<Clipboard value="Hello, world!" />
			<Clipboard value="https://example.com/abc123" />
		</div>
	</section>
</PageLayout>

<style>
	section {
		display: flex;
		flex-direction: column;
		margin-block: 2rem;
		gap: 2rem;

		div {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 0.75rem;
		}

		h2 {
			font-weight: bold;
			margin-bottom: 0.25rem;
		}

		h3 {
			margin-top: 0.75rem;
			margin-bottom: 0.5rem;
		}
	}
</style>
