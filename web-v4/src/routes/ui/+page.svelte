<script lang="ts">
	import { Badge, Button, Clipboard, Field, Input, InputGroup, PageLayout, Alert } from '$lib';
	import { Mail, Search, X } from 'lucide-svelte';
</script>

<PageLayout>
	<div class="max-w-2xl mx-auto">
		<section>
			<h2>Button</h2>

			<div class="group">
				<h3>Variants</h3>
				<div class="examples flex-row!">
					<Button variant="solid">Next</Button>
					<Button variant="outline">Next</Button>
					<Button variant="ghost">Next</Button>
					<Button color="neutral">Next</Button>
					<Button disabled>Next</Button>
				</div>
			</div>

			<div class="group">
				<h3>Colors</h3>
				<div class="examples">
					<h4>Solid</h4>
					<div class="flex-row">
						<Button color="brand">Brand</Button>
						<Button color="neutral">Neutral</Button>
						<Button color="danger">Danger</Button>
						<Button color="danger" disabled>Danger</Button>
					</div>
				</div>
				<div class="examples">
					<h4>Outline</h4>
					<div class="flex-row">
						<Button variant="outline" color="brand">Brand</Button>
						<Button variant="outline" color="neutral">Neutral</Button>
						<Button variant="outline" color="danger">Danger</Button>
						<Button variant="outline" color="danger" disabled>Danger</Button>
					</div>
				</div>
				<div class="examples">
					<h4>Ghost</h4>
					<div class="flex-row">
						<Button variant="ghost" color="brand">Brand</Button>
						<Button variant="ghost" color="neutral">Neutral</Button>
						<Button variant="ghost" color="danger">Danger</Button>
						<Button variant="ghost" color="danger" disabled>Danger</Button>
					</div>
				</div>
			</div>

			<div class="examples">
				<h3>Radius</h3>
				<div class="flex-row">
					<Button size="xs" pill>Next</Button>
					<Button size="sm" pill>Next</Button>
					<Button size="md" pill>Next</Button>
					<Button size="lg" pill>Next</Button>
				</div>
			</div>

			<div class="examples">
				<h3>Sizes</h3>
				<div class="flex-row">
					<Button variant="solid" size="xs">Next</Button>
					<Button variant="solid" size="sm">Next</Button>
					<Button variant="solid" size="md">Next</Button>
					<Button variant="solid" size="lg">Next</Button>
				</div>
			</div>
		</section>

		<section>
			<h2>Form</h2>

			<div class="group">
				<h3>Within Field (auto-connected)</h3>
				<div class="examples">
					<Field name="name" label="Name">
						<Input />
					</Field>

					<Field name="email" label="Email" hint="We'll never share your email." required>
						<Input type="email" />
					</Field>

					<Field
						name="token"
						label="Token"
						errors={[{ id: 'token', title: "Token can't be blank" }]}
					>
						<Input autocomplete="off" />
					</Field>
				</div>
			</div>

			<div class="group">
				<h3>Sizes</h3>
				<div class="examples">
					<Input size="sm" name="sm" placeholder="Small" />
					<Input name="md" placeholder="Medium (default)" />
					<Input size="lg" name="lg" placeholder="Large" />
				</div>
			</div>

			<div class="group">
				<h3>Variants</h3>
				<div class="examples">
					<Input name="outline" placeholder="Outline (default)" />
					<Input variant="filled" name="filled" placeholder="Filled" />
				</div>
			</div>

			<div class="group">
				<h3>Addons</h3>
				<div class="examples">
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
			</div>

			<div class="group">
				<h3>Inline</h3>
				<div class="examples">
					<InputGroup name="inline-start" placeholder="Search...">
						{#snippet start()}<Search size={16} />{/snippet}
					</InputGroup>
					<InputGroup name="inline-end" placeholder="Email">
						{#snippet end()}<Mail size={16} />{/snippet}
					</InputGroup>
					<InputGroup name="inline-end-sm" placeholder="Small" size="sm">
						{#snippet end()}
							<Button
								variant="solid"
								size="xs"
								icon
								class="-mr-2"
								onpointerdown={(e: PointerEvent) => e.stopPropagation()}
							>
								<X size={12} />
							</Button>
						{/snippet}
					</InputGroup>
					<InputGroup name="inline-end-md" placeholder="Medium">
						{#snippet end()}
							<Button
								variant="solid"
								size="sm"
								icon
								class="-mr-2"
								onpointerdown={(e: PointerEvent) => e.stopPropagation()}
							>
								<X size={14} />
							</Button>
						{/snippet}
					</InputGroup>
				</div>
			</div>

			<div class="group">
				<h3>Standalone</h3>
				<div class="examples">
					<Input name="search" type="search" placeholder="Search..." />
				</div>
			</div>
		</section>

		<section>
			<h2>Clipboard</h2>
			<div class="group">
				<h3>Examples</h3>
				<div class="examples">
					<Clipboard value="Hello, world!" />
					<Clipboard value="https://group.com/abc123" />
				</div>
			</div>
		</section>

		<section>
			<h2>Alert</h2>
			<div class="group">
				<h3>Variants</h3>
				<div class="examples">
					<Alert variant="positive">Record saved successfully.</Alert>
					<Alert variant="warning">Reminder is overdue.</Alert>
					<Alert variant="negative">Something went wrong.</Alert>
					<Alert variant="info">No new records this week.</Alert>
				</div>
			</div>

			<div class="group">
				<h3>With role="status"</h3>
				<div class="examples">
					<Alert role="status" variant="positive">Changes saved.</Alert>
				</div>
			</div>

			<div class="group">
				<h3>Dismissible</h3>
				<div class="examples">
					<Alert variant="warning" dismissible>Reminder is overdue. Dismiss this notice.</Alert>
					<Alert variant="info" dismissible>No new records this week.</Alert>
				</div>
			</div>
		</section>

		<section>
			<h2>Badge</h2>

			<div class="group">
				<h3>Variants</h3>
				<div class="examples flex-row!">
					<Badge variant="neutral">Default</Badge>
					<Badge variant="warning">Warning</Badge>
				</div>
			</div>

			<div class="group">
				<h3>Pill</h3>
				<div class="examples flex-row!">
					<Badge pill>Default</Badge>
					<Badge variant="warning" pill>Warning</Badge>
				</div>
			</div>

			<div class="group">
				<h3>Dismissible</h3>
				<div class="examples flex-row!">
					<Badge dismissible>Default</Badge>
					<Badge variant="warning" dismissible>Warning</Badge>
					<Badge variant="warning" pill dismissible>3</Badge>
				</div>
			</div>

			<div class="group">
				<h3>With count</h3>
				<div class="examples flex-row!">
					<Badge variant="warning" pill>3</Badge>
					<Badge pill>12</Badge>
					<Badge variant="warning">42</Badge>
				</div>
			</div>
		</section>
	</div>
</PageLayout>

<style>
	section {
		display: flex;
		flex-direction: column;
		margin-top: 2rem;

		.group {
			display: flex;
			flex-direction: column;

			h3 {
				font-weight: 500;
			}
		}

		.examples {
			margin-bottom: 0.5rem;
			gap: 0.5rem;
			display: flex;
			flex-direction: column;

			h3,
			h4 {
				margin-bottom: 0.5rem;
			}

			div {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				gap: 0.75rem;
			}
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
