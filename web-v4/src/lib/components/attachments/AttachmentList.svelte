<script lang="ts">
	import { Paperclip } from 'lucide-svelte';
	import type { Attachment } from '$lib/data/attachments';
	import { formatBytes } from '$lib/utils/bytes';

	interface Props {
		attachments: Attachment[];
	}

	let { attachments }: Props = $props();
</script>

{#if attachments.length > 0}
	<ul class="flex flex-col gap-1 text-sm">
		{#each attachments as att (att.id)}
			<li class="flex items-center gap-2">
				<Paperclip size={14} class="text-ink-400 shrink-0" />
				<a
					href={att.url}
					download={att.filename}
					class="text-brand-500 hover:text-brand-600 hover:underline truncate flex-1 min-w-0"
					title={att.filename}
				>
					{att.filename}
				</a>
				<span class="text-ink-400 text-xs whitespace-nowrap">{formatBytes(att.byteSize)}</span>
			</li>
		{/each}
	</ul>
{/if}
