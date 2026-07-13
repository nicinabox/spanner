<script lang="ts">
	import { Input } from '$lib';
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
