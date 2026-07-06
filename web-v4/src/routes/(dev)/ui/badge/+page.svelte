<script lang="ts">
	import { Badge } from '$lib';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';
</script>

<Section title="Badge">
	<Group title="Variants">
		<div>
			<Badge variant="neutral">Default</Badge>
			<Badge variant="warning">Warning</Badge>
		</div>
		<div>
			<Badge pill variant="neutral">Default</Badge>
			<Badge pill variant="warning">Warning</Badge>
		</div>
	</Group>

	<Group title="Sizes">
		<div>
			<Badge size="sm">Small</Badge>
			<Badge size="md">Medium</Badge>
		</div>
	</Group>

	<Group title="Dismissible">
		<div>
			<Badge dismissible variant="neutral">Default</Badge>
			<Badge dismissible variant="warning">Warning</Badge>
			<Badge dismissible size="md" variant="warning">Medium</Badge>
		</div>
		<div>
			<Badge dismissible pill variant="neutral">Default</Badge>
			<Badge dismissible pill variant="warning">Warning</Badge>
			<Badge dismissible pill size="md" variant="warning">Medium</Badge>
		</div>
	</Group>

	<Group title="Count">
		<div>
			<Badge pill>12</Badge>
			<Badge variant="warning" pill>3</Badge>
			<Badge variant="warning">42</Badge>
		</div>
	</Group>
</Section>
