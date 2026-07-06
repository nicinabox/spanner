<script lang="ts">
	import { SplitButton } from '$lib';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';
</script>

<Section title="SplitButton">
	<Group title="Variants">
		<div>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
					{ value: '', separator: true },
					{ value: 'delete', label: 'Delete' },
				]}
				onAction={() => {}}
				onSelect={(e: { value: string }) => console.log(e.value)}
				variant="solid"
			>
				Primary
			</SplitButton>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => {}}
				variant="outline"
			>
				Primary
			</SplitButton>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => {}}
				variant="ghost"
			>
				Primary
			</SplitButton>
		</div>
	</Group>

	<Group title="Colors">
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

	<Group title="Sizes">
		<div>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => {}}
				size="xs"
			>
				Extra Small
			</SplitButton>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => {}}
				size="sm"
			>
				Small
			</SplitButton>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => {}}
				size="md"
			>
				Medium
			</SplitButton>
			<SplitButton
				items={[
					{ value: 'edit', label: 'Edit' },
					{ value: 'duplicate', label: 'Duplicate' },
				]}
				onAction={() => {}}
				size="lg"
			>
				Large
			</SplitButton>
		</div>
	</Group>
</Section>
