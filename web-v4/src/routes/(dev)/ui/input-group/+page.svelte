<script lang="ts">
	import { Button, Input, InputGroup, InputAddon, Textarea, Badge } from '$lib';
	import Group from '../components/Group.svelte';
	import Section from '../components/Section.svelte';
	import { Search, Mail, X, RefreshCw } from 'lucide-svelte';
</script>

<Section title="InputGroup">
	<Group title="Horizontal (default)">
		<InputGroup>
			<InputAddon><Search size={16} /></InputAddon>
			<Input placeholder="Search..." />
		</InputGroup>
		<InputGroup>
			<Input placeholder="Email" />
			<InputAddon><Mail size={16} /></InputAddon>
		</InputGroup>
		<InputGroup>
			<InputAddon><Search size={16} /></InputAddon>
			<Input placeholder="Search..." />
			<InputAddon>
				<Button variant="ghost" size="sm" icon>
					<X size={14} />
				</Button>
			</InputAddon>
		</InputGroup>
		<InputGroup>
			<Textarea placeholder="Generate with AI..." rows={1} />
			<Button variant="ghost" size="sm" icon class="mr-1">
				<RefreshCw size={14} />
			</Button>
		</InputGroup>
		<InputGroup>
			<Textarea placeholder="Multi-line note..." rows={3} />
			<Button variant="ghost" size="sm" icon class="mr-1 self-start mt-1">
				<RefreshCw size={14} />
			</Button>
		</InputGroup>
	</Group>

	<Group title="Text addons">
		<InputGroup>
			<InputAddon>$</InputAddon>
			<Input placeholder="Amount" />
		</InputGroup>
		<InputGroup>
			<Input placeholder="Distance" />
			<InputAddon>mi</InputAddon>
		</InputGroup>
		<InputGroup>
			<InputAddon>$</InputAddon>
			<Input placeholder="Amount" />
			<InputAddon>USD</InputAddon>
		</InputGroup>
	</Group>

	<Group title="Vertical">
		<InputGroup orientation="vertical">
			<span class="px-3 pt-2 text-xs text-ink-500">Bio</span>
			<Textarea placeholder="Tell us about yourself..." rows={3} />
		</InputGroup>
		<InputGroup orientation="vertical">
			<Textarea placeholder="Add a comment..." rows={2} />
			<div class="flex gap-1 px-3 pb-2.5">
				<Badge size="sm" variant="neutral">#feature</Badge>
				<Badge size="sm" variant="neutral">#bug</Badge>
				<Badge size="sm" variant="neutral">#question</Badge>
			</div>
		</InputGroup>
	</Group>

	<Group title="Variants">
		<InputGroup variant="outline">
			<InputAddon><Search size={16} /></InputAddon>
			<Input placeholder="Outline" />
		</InputGroup>
		<InputGroup variant="filled">
			<InputAddon><Search size={16} /></InputAddon>
			<Input placeholder="Filled" />
		</InputGroup>
	</Group>

	<Group title="Sizes">
		<InputGroup size="sm">
			<InputAddon class="p-2"><Search size={14} /></InputAddon>
			<Input placeholder="Small" />
		</InputGroup>
		<InputGroup size="md">
			<InputAddon><Search size={16} /></InputAddon>
			<Input placeholder="Medium" />
		</InputGroup>
		<InputGroup size="lg">
			<InputAddon class="p-4"><Search size={18} /></InputAddon>
			<Input placeholder="Large" />
		</InputGroup>
	</Group>
</Section>
