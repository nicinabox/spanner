<script lang="ts">
	import { Button } from '$lib';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';
</script>

<Section title="Button">
	<Group title="Solid">
		<div>
			<Button color="brand">Brand</Button>
			<Button color="neutral">Neutral</Button>
			<Button color="danger">Danger</Button>
		</div>
		<div>
			<Button disabled color="brand">Brand</Button>
			<Button disabled color="neutral">Neutral</Button>
			<Button disabled color="danger">Danger</Button>
		</div>
	</Group>

	<Group title="Outline">
		<div>
			<Button variant="outline" color="brand">Brand</Button>
			<Button variant="outline" color="neutral">Neutral</Button>
			<Button variant="outline" color="danger">Danger</Button>
		</div>
		<div>
			<Button disabled variant="outline" color="brand">Brand</Button>
			<Button disabled variant="outline" color="neutral">Neutral</Button>
			<Button disabled variant="outline" color="danger">Danger</Button>
		</div>
	</Group>

	<Group title="Ghost">
		<div>
			<Button variant="ghost" color="brand">Brand</Button>
			<Button variant="ghost" color="neutral">Neutral</Button>
			<Button variant="ghost" color="danger">Danger</Button>
		</div>
		<div>
			<Button disabled variant="ghost" color="brand">Brand</Button>
			<Button disabled variant="ghost" color="neutral">Neutral</Button>
			<Button disabled variant="ghost" color="danger">Danger</Button>
		</div>
	</Group>

	<Group title="Size & Radius">
		<div>
			<Button variant="solid" size="xs">Button</Button>
			<Button variant="solid" size="sm">Button</Button>
			<Button variant="solid" size="md">Button</Button>
			<Button variant="solid" size="lg">Button</Button>
		</div>
		<div>
			<Button size="xs" pill>Button</Button>
			<Button size="sm" pill>Button</Button>
			<Button size="md" pill>Button</Button>
			<Button size="lg" pill>Button</Button>
		</div>
	</Group>
</Section>
