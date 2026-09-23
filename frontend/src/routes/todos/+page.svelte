<script lang="ts">
	import PageTitle from '../../components/PageTitle.svelte';
	import Todo from '../../components/Todo/Todo.svelte';
	import { getIsAuthPending, getIsLoggedIn } from '$lib/AuthClient.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { getTodos, removeTodo, toggleTodoCompletionStatus } from '../../api/client';
	import { onMount } from 'svelte';
	import type { todo } from '../../types/todo';
	import { page } from '$app/state';
	import DeleteTodoModal from '../../components/Todo/DeleteTodoModal.svelte';

	let todos: todo[] = $state([]);

	type modal_props = {
		modal_type: 'delete';
		todo_title: string;
		todo_id: string;
	};

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
				<Todo task={todo} onClickDeleteButton={() => goto(`?modal_type=delete&todo_id=${todo.id}`,{replaceState:true})} onToggleCompletionStatus={(completion_status)=>{
					todos = todos.map((t)=>{
						if (t.id === todo.id){
							return {
								...t,
								is_completed:completion_status
							}
						}
						return t;
					})

					toggleTodoCompletionStatus(todo.id, completion_status)
				}}
				></Todo>
			</div>
		{/each}
	</div>
	<button class="btn btn-primary" style="width:fit-content;">Add todo</button>
</div>

{#if modal?.modal_type === 'delete'}
	<DeleteTodoModal
		onDelete={async () => {
			todos = todos.filter((todo) => todo.id !== modal?.todo_id);
			goto(`/todos`,{replaceState:true})
			if (typeof modal?.todo_id === 'string') await removeTodo(modal?.todo_id);
		}}
		onCancel={() => {
			goto(`/todos`,{replaceState:true})
		}}
		todo_title={modal.todo_title}
	></DeleteTodoModal>
{/if}
