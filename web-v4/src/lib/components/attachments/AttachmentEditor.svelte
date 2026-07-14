<script lang="ts">
	import { Paperclip, Trash2, RotateCcw } from 'lucide-svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FileInput from '$lib/components/common/FileInput.svelte';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import type { Attachment } from '$lib/data/attachments';
	import { ATTACHMENT_SIZE_LIMIT } from '$lib/data/attachments';
	import { formatBytes } from '$lib/utils/bytes';

	interface Props {
		existing: Attachment[];
		markedForDeletion: string[];
		onMarkDelete: (id: string) => void;
		onRestore: (id: string) => void;
		/** New files staged for upload. Parent binds and submits. */
		selectedFiles?: File[];
		onSelectedFilesChange?: (files: File[]) => void;
	}

	let {
		existing,
		markedForDeletion,
		onMarkDelete,
		onRestore,
		selectedFiles = $bindable([]),
		onSelectedFilesChange,
	}: Props = $props();

	let fileError = $state<string | null>(null);

	function fileKey(file: File): string {
		return `${file.name}_${file.size}_${file.lastModified}`;
	}

	function handleFileInput(input: HTMLInputElement) {
		const list = input.files;
		if (!list) return;
		const existingKeys = new Set(selectedFiles.map(fileKey));
		const additions: File[] = [];
		for (const file of Array.from(list)) {
			if (file.size > ATTACHMENT_SIZE_LIMIT) {
				fileError = `"${file.name}" exceeds 10MB limit`;
				input.value = '';
				return;
			}
			const key = fileKey(file);
			if (existingKeys.has(key)) continue;
			existingKeys.add(key);
			additions.push(file);
		}
		if (additions.length === 0) {
			input.value = '';
			return;
		}
		fileError = null;
		const next = [...selectedFiles, ...additions];
		selectedFiles = next;
		onSelectedFilesChange?.(next);
		input.value = '';
	}

	function removeNewFile(index: number) {
		const next = selectedFiles.filter((_, i) => i !== index);
		selectedFiles = next;
		onSelectedFilesChange?.(next);
	}
</script>

<div class="flex flex-col gap-2">
	{#if existing.length > 0}
		<ul class="flex flex-col gap-2 text-sm">
			{#each existing as att (att.id)}
				{@const marked = markedForDeletion.includes(att.id)}
				<li class="flex items-center gap-2">
					<Paperclip size={14} class="text-ink-400 shrink-0" />
					<span class="flex-1 min-w-0">
						<span
							class="block truncate font-medium {marked ? 'line-through text-ink-400' : ''}"
							title={att.filename}
						>
							{att.filename}
						</span>
						<span class="block text-xs text-ink-400">{formatBytes(att.byteSize)}</span>
					</span>
					{#if marked}
						<Tooltip content={`Restore ${att.filename}`}>
							{#snippet children(triggerProps)}
								<Button
									size="sm"
									variant="ghost"
									color="neutral"
									icon
									{...triggerProps}
									onclick={() => onRestore(att.id)}
									aria-label="Restore {att.filename}"
								>
									<RotateCcw size={14} />
								</Button>
							{/snippet}
						</Tooltip>
					{:else}
						<Button
							size="sm"
							variant="ghost"
							color="neutral"
							icon
							onclick={() => onMarkDelete(att.id)}
							aria-label="Remove {att.filename}"
						>
							<Trash2 size={14} />
						</Button>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#if selectedFiles.length > 0}
		<ul class="flex flex-col gap-2 text-sm">
			{#each selectedFiles as file, i (fileKey(file))}
				<li class="flex items-center gap-2">
					<Paperclip size={14} class="text-ink-400 shrink-0" />
					<span class="flex-1 min-w-0">
						<span class="block truncate font-medium" title={file.name}>{file.name}</span>
						<span class="block text-xs text-ink-400">{formatBytes(file.size)}</span>
					</span>
					<Button
						size="sm"
						variant="ghost"
						color="neutral"
						icon
						onclick={() => removeNewFile(i)}
						aria-label="Remove {file.name}"
					>
						<Trash2 size={14} />
					</Button>
				</li>
			{/each}
		</ul>
	{/if}

	<div>
		<FileInput
			name="attachments[]"
			multiple
			buttonLabel="Add files"
			onChange={handleFileInput}
		/>
		{#if fileError}
			<p class="text-sm text-negative mt-1">{fileError}</p>
		{/if}
		<p class="text-xs text-ink-400 mt-1">Max 10MB per file</p>
	</div>
</div>
