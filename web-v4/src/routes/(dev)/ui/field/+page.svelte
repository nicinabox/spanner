<script lang="ts">
	import { Field, Input } from '$lib';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';
</script>

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
