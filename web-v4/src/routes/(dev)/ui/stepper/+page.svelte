<script lang="ts">
	import { Stepper, InputGroup, InputAddon, Input } from '$lib';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';

	let qty = $state(1);
	let small = $state(3);
	let large = $state(10);
	let inGroup = $state(2);
</script>

<Section title="Stepper">
	<Group title="Basic">
		<div class="flex items-center gap-3">
			<Stepper onincrement={() => qty++} ondecrement={() => qty--} />
			<span class="text-lg font-medium min-w-[2ch] text-center">{qty}</span>
		</div>
	</Group>

	<Group title="Sizes">
		<div class="flex items-center gap-3">
			<Stepper size="sm" onincrement={() => small++} ondecrement={() => small--} />
			<span>{small}</span>
		</div>
		<div class="flex items-center gap-3">
			<Stepper size="md" onincrement={() => qty++} ondecrement={() => qty--} />
			<span>{qty}</span>
		</div>
		<div class="flex items-center gap-3">
			<Stepper size="lg" onincrement={() => large++} ondecrement={() => large--} />
			<span>{large}</span>
		</div>
	</Group>

	<Group title="Variants">
		<Stepper variant="solid" color="brand" onincrement={() => {}} ondecrement={() => {}} />
		<Stepper variant="outline" color="neutral" onincrement={() => {}} ondecrement={() => {}} />
		<Stepper variant="ghost" color="neutral" onincrement={() => {}} ondecrement={() => {}} />
	</Group>

	<Group title="Disabled">
		<Stepper disabled onincrement={() => {}} ondecrement={() => {}} />
	</Group>

	<Group title="Inside InputGroup">
		<InputGroup class="w-72">
			<InputAddon>Qty</InputAddon>
			<Input bind:value={inGroup} />
			<Stepper
				size="sm"
				variant="ghost"
				class="mr-1"
				onincrement={() => inGroup++}
				ondecrement={() => inGroup--}
			/>
		</InputGroup>
	</Group>
</Section>
