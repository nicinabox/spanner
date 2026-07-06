<script lang="ts">
	import { Button, Combobox, Field, Input, InputGroup } from '$lib';
	import { Mail, Search, X } from 'lucide-svelte';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';
</script>

<Section title="Input">
	<Group title="Variants">
		<Input name="outline" placeholder="Outline (default)" />
		<Input variant="filled" name="filled" placeholder="Filled" />
	</Group>

	<Group title="Sizes">
		<Input size="sm" name="sm" placeholder="Small" />
		<Input name="md" placeholder="Medium (default)" />
		<Input size="lg" name="lg" placeholder="Large" />
	</Group>
</Section>

<Section title="Field">
	<Group>
		<Field name="name" label="Name">
			<Input />
		</Field>

		<Field name="email" label="Email" hint="We'll never share your email." required>
			<Input type="email" />
		</Field>

		<Field name="token" label="Token" errors={[{ id: 'token', title: "Token can't be blank" }]}>
			<Input autocomplete="off" />
		</Field>
	</Group>
</Section>

<Section title="InputGroup">
	<Group title="Addons">
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
	</Group>

	<Group title="Inline">
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
	</Group>
</Section>

<Section title="Combobox">
	<Group>
		<Combobox
			name="keywords"
			placeholder="Select or add keywords"
			value={['oil change']}
			multiple
			options={[
				{
					value: 'oil change',
					label: 'oil change',
				},
				{
					value: 'dot4',
					label: 'dot4',
				},
				{
					value: 'oil filter',
					label: 'oil filter',
				},
			]}
		/>
	</Group>

	<Group title="Add custom value">
		<Combobox
			name="keywords"
			placeholder="Select or add keywords"
			value={[]}
			multiple
			options={[]}
		/>
	</Group>
</Section>
