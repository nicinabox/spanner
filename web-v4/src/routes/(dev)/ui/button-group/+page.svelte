<script lang="ts">
	import { Button, ButtonGroup, SplitButton, Menu } from '$lib';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';
	import { ChevronDown } from 'lucide-svelte';
</script>

<Section title="ButtonGroup">
	<Group title="Basic">
		<div>
			<ButtonGroup>
				<Button>Left</Button>
				<Button>Center</Button>
				<Button>Right</Button>
			</ButtonGroup>
		</div>
	</Group>

	<Group title="Variants">
		<div>
			<ButtonGroup>
				<Button variant="solid">Solid</Button>
				<Button variant="solid">Solid</Button>
				<Button variant="solid">Solid</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="outline">Outline</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="outline">Outline</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="ghost">Ghost</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="ghost">Ghost</Button>
			</ButtonGroup>
		</div>
	</Group>

	<Group title="Colors">
		<div>
			<ButtonGroup>
				<Button color="brand">Brand</Button>
				<Button color="brand">Brand</Button>
				<Button color="brand">Brand</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="neutral">Neutral</Button>
				<Button color="neutral">Neutral</Button>
				<Button color="neutral">Neutral</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button color="danger">Danger</Button>
				<Button color="danger">Danger</Button>
				<Button color="danger">Danger</Button>
			</ButtonGroup>
		</div>
	</Group>

	<Group title="Sizes">
		<div>
			<ButtonGroup>
				<Button size="xs">XS</Button>
				<Button size="xs">XS</Button>
				<Button size="xs">XS</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button size="sm">SM</Button>
				<Button size="sm">SM</Button>
				<Button size="sm">SM</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button size="md">MD</Button>
				<Button size="md">MD</Button>
				<Button size="md">MD</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button size="lg">LG</Button>
				<Button size="lg">LG</Button>
				<Button size="lg">LG</Button>
			</ButtonGroup>
		</div>
	</Group>

	<Group title="Mixed variants">
		<div>
			<ButtonGroup>
				<Button variant="solid">Save</Button>
				<Button variant="outline">Cancel</Button>
				<Button variant="ghost">Delete</Button>
			</ButtonGroup>
		</div>
	</Group>

	<Group title="With Menu (SplitButton composition)">
		<div>
			<ButtonGroup>
				<Button onclick={() => console.log('primary action')}>Primary</Button>
				<Menu
					items={[
						{ value: 'edit', label: 'Edit' },
						{ value: 'duplicate', label: 'Duplicate' },
						{ value: '', separator: true },
						{ value: 'delete', label: 'Delete' },
					]}
					onSelect={(e) => console.log(e.value)}
				>
					<ChevronDown size={16} />
				</Menu>
			</ButtonGroup>
		</div>
	</Group>

	<Group title="SplitButton convenience wrapper">
		<div>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
					{ value: '', separator: true },
					{ value: 'delete', label: 'Delete' },
				]}
				onAction={() => console.log('action')}
				onSelect={(e) => console.log(e.value)}
			>
				Primary
			</SplitButton>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => console.log('action')}
				variant="outline"
			>
				Primary
			</SplitButton>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => console.log('action')}
				variant="ghost"
			>
				Primary
			</SplitButton>
		</div>
	</Group>

	<Group title="SplitButton colors">
		<div>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => {}}
				color="brand"
			>
				Brand
			</SplitButton>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => {}}
				color="neutral"
			>
				Neutral
			</SplitButton>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => {}}
				color="danger"
			>
				Danger
			</SplitButton>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => {}}
				color="danger"
				disabled
			>
				Disabled
			</SplitButton>
		</div>
	</Group>

	<Group title="SplitButton sizes">
		<div>
			<SplitButton
				items={[{ value: 'edit', label: 'Edit' }]}
				onAction={() => {}}
				size="xs"
			>
				XS
			</SplitButton>
			<SplitButton
				items={[{ value: 'edit', label: 'Edit' }]}
				onAction={() => {}}
				size="sm"
			>
				SM
			</SplitButton>
			<SplitButton
				items={[{ value: 'edit', label: 'Edit' }]}
				onAction={() => {}}
				size="md"
			>
				MD
			</SplitButton>
			<SplitButton
				items={[{ value: 'edit', label: 'Edit' }]}
				onAction={() => {}}
				size="lg"
			>
				LG
			</SplitButton>
		</div>
	</Group>
</Section>
