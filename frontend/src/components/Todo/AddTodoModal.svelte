<script lang="ts">
	import type { Modal } from 'bootstrap';
	import { onMount } from 'svelte';
	import TodoTitleEditor from './TodoTitleEditor.svelte';

	const {
		todo_title,
        todo_description,
        onAddTodo,
		onCancel,
	}: { todo_title: string; todo_description:string, onAddTodo: (title:string, description:string) => void; onCancel: () => void } = $props();
	let modal_element: HTMLDivElement;

    let todo_state = $state({
        title:todo_title,
        description:todo_description
    })
	
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
				<TodoTitleEditor todo_title={todo_state.title} onTodoTitleChange={(new_todo_title)=>{
					todo_state.title = new_todo_title
				}} ></TodoTitleEditor>
				<textarea placeholder="Description" style="all:unset;width:100%;field-sizing:content;" onchange={(element)=>{
					todo_state.description = element.currentTarget.value;
				}}>{todo_state.description}</textarea>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-sm btn-secondary me-3" onclick={onCancel}>Cancel</button>
				<button type="button" class="btn btn-sm btn-primary" onclick={()=>{
                    onAddTodo(todo_state.title,todo_state.description)
                }}>Add todo</button>
			</div>
		</div>
	</div>
</div>
