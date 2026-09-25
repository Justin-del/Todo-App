<script lang="ts">
	import PageTitle from '../../components/PageTitle.svelte';
	import Todo from '../../components/Todo/Todo.svelte';
	import { getIsAuthPending, getIsLoggedIn } from '$lib/AuthClient.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { addTodo, editTodo, getTodos, removeTodo, toggleTodoCompletionStatus } from '../../api/client';
	import { onMount } from 'svelte';
	import type { todo } from '../../types/todo';
	import { page } from '$app/state';
	import DeleteTodoModal from '../../components/Todo/DeleteTodoModal.svelte';
	import AddTodoModal from '../../components/Todo/AddTodoModal.svelte';
	import EditTodoModal from '../../components/Todo/EditTodoModal.svelte';

	let todos: todo[] = $state([]);

	type modal_props =
		| {
				modal_type: 'delete';
				todo_title: string;
				todo_id: string;
		  }
		| { modal_type: 'add'; 
		    /**
			 * The initial todo title shown when the modal is shown.
			 */
			todo_title: string; 
			/**
			 * The initial todo description shown when the modal is shown.
			*/
			todo_description: string }
		|{
			modal_type:'edit';
			todo_id:string;
			/**
			 * The initial todo title shown when the modal is shown.
			 */
			todo_title:string;
			/**
			 * The initial todo description shown when the modal is shown.
			*/
			todo_description:string;
			/**
			 * The initial is_completed shown when the modal is shown.
			 */
			is_completed:0|1;
		}

	let modal: modal_props | undefined = $state();

	onMount(async () => {
		const response = await getTodos();
		if (response.status === 200) {
			const { todos: todos_from_server } = await response.json();
			todos = todos_from_server as {
				id: string;
				title: string;
				description: string;
				is_completed: 0 | 1;
			}[];
		}
	});

	$effect(() => {
		const modal_type = page.url.searchParams.get('modal_type');
		if (modal_type === 'delete') {
			const todo_id = page.url.searchParams.get('todo_id');
			if (todo_id !== null) {
				const todo_to_be_deleted = todos.find((todo) => todo.id === todo_id);
				if (todo_to_be_deleted !== undefined) {
					modal = {
						modal_type: 'delete',
						todo_title: todo_to_be_deleted.title,
						todo_id
					};
				}
			}
		} else if (modal_type === 'add') {
			const todo_title = page.url.searchParams.get('todo_title') ?? '';
			const todo_description = page.url.searchParams.get('todo_description') ?? '';
			modal = {
				modal_type:'add',
				todo_title,
				todo_description
			}
		} else if (modal_type === 'edit') {
			const todo_title = page.url.searchParams.get('todo_title') ?? '';
			const todo_description = page.url.searchParams.get('todo_description') ?? '';
			const is_completed = page.url.searchParams.get('is_completed')??'';

			const todo_id = page.url.searchParams.get('todo_id')??"";

			modal = {
				modal_type:'edit',
				todo_title,
				todo_description,
				is_completed:(is_completed==='1')?1:0,
				todo_id
			}

		} else {
			modal = undefined;
		}
	});

	$effect(() => {
		if (!getIsAuthPending())
			if (browser && !getIsLoggedIn()) {
				goto('/login', { replaceState: true });
			}
	});
</script>

<div class="d-flex flex-column" style="height:90%;max-height:90%;">
	<PageTitle title="Todos"></PageTitle>
	<div class="flex-grow-1 overflow-auto">
		{#each todos as todo (todo.id)}
			<div class="d-contents mb-3">
				<Todo
					task={todo}
					onClickEditButton={()=>{
						goto(`?modal_type=edit&todo_id=${todo.id}&todo_title=${todo.title}&todo_description=${todo.description}&is_completed=${todo.is_completed}`,{replaceState:true});
					}}
					onClickDeleteButton={() =>
						goto(`?modal_type=delete&todo_id=${todo.id}`, { replaceState: true })}
					onToggleCompletionStatus={(completion_status) => {
						todos = todos.map((t) => {
							if (t.id === todo.id) {
								return {
									...t,
									is_completed: completion_status
								};
							}
							return t;
						});

						toggleTodoCompletionStatus(todo.id, completion_status);
					}}
				></Todo>
			</div>
		{/each}
	</div>
	<button
		class="btn btn-primary"
		style="width:fit-content;"
		onclick={() => {
			goto('/todos?modal_type=add', { replaceState: true });
		}}>Add todo</button
	>
</div>

{#if modal?.modal_type === 'delete'}
	<DeleteTodoModal
		onDelete={() => {
			if (modal?.modal_type!=='delete') return;
			todos = todos.filter((todo) => modal?.modal_type==='delete' && modal?.todo_id!==todo.id);
			goto(`/todos`, { replaceState: true });
			if (typeof modal?.todo_id === 'string') removeTodo(modal?.todo_id);
		}}
		onCancel={() => {
			goto(`/todos`, { replaceState: true });
		}}
		todo_title={modal.todo_title}
	></DeleteTodoModal>
{:else if modal?.modal_type === 'add'}
		<AddTodoModal onAddTodo={
			(title:string, description:string)=>{
				const new_todo:todo = {
					id:crypto.randomUUID(),
					title,
					description,
					is_completed:0
				}

				todos = [...todos,new_todo];

				addTodo(new_todo.id,title,description);
			}
		} onCancel={()=>{goto("/todos",{replaceState:true})}} todo_title={modal?.todo_title} todo_description={modal?.todo_description}>

		</AddTodoModal>
{:else if modal?.modal_type === 'edit'}
<EditTodoModal initial_todo_title_shown={modal?.todo_title} initial_todo_description_shown={modal?.todo_description} initial_is_completed_shown={modal?.is_completed} onCancel={()=>{goto("/todos",{replaceState:true})}} onSaveChanges={(title,description,is_completed)=>{
	if (modal?.modal_type!=='edit'){
		return;
	}
	const todo_id = modal?.todo_id
	todos = todos.map(todo=>{
		if (todo.id===todo_id){
			return {
				id:todo.id,
				title,
				description,
				is_completed
			}
		}

		return todo;
	})
	goto("/todos",{replaceState:true});

	editTodo(todo_id, title,description,is_completed);
}}>

</EditTodoModal>

{/if}
