<script lang="ts">
	import { Alert } from '$lib';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';
</script>

<Section title="Alert">
	<Group title="Variants">
		<Alert variant="positive">Record saved successfully.</Alert>
		<Alert variant="warning">Reminder is overdue.</Alert>
		<Alert variant="negative">Something went wrong.</Alert>
		<Alert variant="info">No new records this week.</Alert>
	</Group>

	<Group title="Role">
		<Alert role="status">Role status</Alert>
		<Alert role="alert">Role Alert</Alert>
	</Group>

	<Group title="Dismissible">
		<Alert variant="warning" dismissible>Reminder is overdue. Dismiss this notice.</Alert>
		<Alert variant="info" dismissible>No new records this week.</Alert>
	</Group>
</Section>
