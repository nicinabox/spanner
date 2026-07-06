<script lang="ts">
	import { Clipboard } from '$lib';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';
</script>

<Section title="Clipboard">
	<Group>
		<Clipboard value="https://group.com/abc123" />
	</Group>
</Section>
