<script lang="ts">
	import { Combobox } from '$lib';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';
</script>

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
