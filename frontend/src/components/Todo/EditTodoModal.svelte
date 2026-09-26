<script lang="ts">
	import type { Modal } from 'bootstrap';
	import { onMount } from 'svelte';
	import TodoTitleEditor from './TodoTitleEditor.svelte';

	const {
		initial_todo_title_shown,
		initial_todo_description_shown,
		initial_is_completed_shown,
		onSaveChanges: onSaveChanges,
		onCancel
	}: {
		initial_todo_title_shown: string;
		initial_todo_description_shown: string;
		initial_is_completed_shown: 0 | 1;
		onSaveChanges: (title: string, description: string, is_completed: 0 | 1) => void;
		onCancel: () => void;
	} = $props();
	let modal_element: HTMLDivElement;

	let todo_state = $state({
		title: initial_todo_title_shown,
		description: initial_todo_description_shown,
		is_completed: initial_is_completed_shown === 1
	});

	onMount(() => {
		let modal: Modal;

		(async () => {
			const { Modal } = await import('bootstrap');
			modal = Modal.getOrCreateInstance(modal_element, { backdrop: 'static', keyboard: false });
			modal.show();
			modal_element.addEventListener('hidePrevented.bs.modal', onCancel);
		})();

		return () => {
			modal_element.removeEventListener('hidePrevented.bs.modal', onCancel);
			modal.dispose();
		};
	});
</script>

<div class="modal" tabindex="-1" bind:this={modal_element}>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-body p-2">
				<TodoTitleEditor
					todo_title={todo_state.title}
					onTodoTitleChange={(new_todo_title) => {
						todo_state.title = new_todo_title;
					}}
				></TodoTitleEditor>
				<textarea
					placeholder="Description"
					style="all:unset;width:100%;field-sizing:content;"
					class="mb-3"
					onchange={(element) => {
						todo_state.description = element.currentTarget.value;
					}}>{todo_state.description}</textarea
				>
				<div class="mb-3">
					<input
						type="checkbox"
						id="is-completed"
						bind:checked={todo_state.is_completed}
					/>
					<label class="ms-2 form-check-label" for="is-completed">Completed</label>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-secondary me-3" onclick={onCancel}
					>Cancel</button
				>
				<button
					type="button"
					class="btn btn-sm btn-primary"
					onclick={() => {
						onSaveChanges(
							todo_state.title,
							todo_state.description,
							todo_state.is_completed ? 1 : 0
						);
					}}>Save changes</button
				>
			</div>
		</div>
	</div>
</div>
