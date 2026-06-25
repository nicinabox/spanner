<script lang="ts">
	import { Paperclip, Trash2, RotateCcw } from 'lucide-svelte';
	import Button from '$lib/components/common/Button.svelte';
	import type { Attachment } from '$lib/data/attachments';
	import { ATTACHMENT_SIZE_LIMIT } from '$lib/data/attachments';
	import { formatBytes } from '$lib/utils/bytes';

	interface Props {
		existing: Attachment[];
		markedForDeletion: string[];
		onMarkDelete: (id: string) => void;
		onRestore: (id: string) => void;
	}

	let { existing, markedForDeletion, onMarkDelete, onRestore }: Props = $props();

	let fileError = $state<string | null>(null);
	let files: FileList | undefined = $state();
	let inputEl: HTMLInputElement | undefined = $state();

	function handleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const list = input.files;
		if (!list) return;
		for (const file of Array.from(list)) {
			if (file.size > ATTACHMENT_SIZE_LIMIT) {
				fileError = `"${file.name}" exceeds 10MB limit`;
				input.value = '';
				files = undefined;
				return;
			}
		}
		fileError = null;
	}

	let selectedFiles = $derived(files ? Array.from(files) : []);
</script>

<div class="flex flex-col gap-4">
	{#if existing.length > 0}
		<div>
			<h4 class="text-sm font-medium mb-2">Current attachments</h4>
			<ul class="flex flex-col gap-1 text-sm">
				{#each existing as att (att.id)}
					{@const marked = markedForDeletion.includes(att.id)}
					<li class="flex items-center gap-2">
						<Paperclip size={14} class="text-ink-400 shrink-0" />
						<span
							class="truncate flex-1 min-w-0 {marked ? 'line-through text-ink-400' : ''}"
							title={att.filename}
						>
							{att.filename}
						</span>
						<span class="text-ink-400 text-xs whitespace-nowrap">
							{formatBytes(att.byteSize)}
						</span>
						{#if marked}
							<Button
								size="xs"
								variant="ghost"
								color="neutral"
								onclick={() => onRestore(att.id)}
								aria-label="Restore {att.filename}"
							>
								<RotateCcw size={14} />
								Restore
							</Button>
						{:else}
							<Button
								size="xs"
								variant="ghost"
								color="neutral"
								onclick={() => onMarkDelete(att.id)}
								aria-label="Remove {att.filename}"
							>
								<Trash2 size={14} />
							</Button>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if selectedFiles.length > 0}
		<div>
			<h4 class="text-sm font-medium mb-2">New files to upload</h4>
			<ul class="flex flex-col gap-1 text-sm">
				{#each selectedFiles as file, i (file.name + '_' + file.lastModified + '_' + i)}
					<li class="flex items-center gap-2">
						<Paperclip size={14} class="text-ink-400 shrink-0" />
						<span class="truncate flex-1 min-w-0" title={file.name}>{file.name}</span>
						<span class="text-ink-400 text-xs whitespace-nowrap">{formatBytes(file.size)}</span>
					</li>
				{/each}
			</ul>
			<p class="text-xs text-ink-400 mt-1">Re-pick via "Add files" to change selection.</p>
		</div>
	{/if}

	<div>
		<Button variant="outline" size="sm" onclick={() => inputEl?.click()}>
			<Paperclip size={16} />
			Add files
		</Button>
		<input
			bind:this={inputEl}
			bind:files
			type="file"
			multiple
			name="record[attachments][]"
			class="hidden"
			onchange={handleChange}
		/>
		{#if fileError}
			<p class="text-sm text-negative mt-1">{fileError}</p>
		{/if}
		<p class="text-xs text-ink-400 mt-1">Max 10MB per file</p>
	</div>
</div>
