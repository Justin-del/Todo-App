<script lang="ts">
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { schema } from 'prosemirror-schema-basic';
	import { onMount } from 'svelte';
	let editorElement: HTMLDivElement;

	const {
		todo_title,
		onTodoTitleChange
	}: { todo_title: string; onTodoTitleChange: (new_todo_title: string) => void } = $props();

	onMount(() => {
		const doc = schema.node('doc', null, [
			schema.node('paragraph', null, (todo_title!=="")?[schema.text(todo_title)]:[])
		]);

		const state = EditorState.create({
			schema,
			doc
		});

		const view = new EditorView(editorElement, {
			state,
			dispatchTransaction(tr) {
				// 1. Apply the transaction to get the updated state
				const newState = view.state.apply(tr);
				view.updateState(newState);

				// 2. Check if the document content actually changed (ignores cursor moves)
				if (tr.docChanged) {
					const updatedText = newState.doc.textContent;

					// Fire your custom onChange handler or state update here
					onTodoTitleChange(updatedText);
				}
			}
		});
		

		const focus_editor =  (number_of_retries_left:number)=>{
			if (number_of_retries_left === 0) return;
			view.focus();
			if (!view.hasFocus()){
				return requestAnimationFrame(()=>focus_editor(number_of_retries_left-1));
			}
		}

		focus_editor(10);
		return ()=>{
			if (!view.isDestroyed){
				view.destroy();
			}
		}
	});
</script>

<div bind:this={editorElement} style="width:100%;" class="editor fw-bold lead" aria-label="todo title editor"></div>

<style>
	.editor {
		& :global(.ProseMirror-focused){
			outline:none;
			box-shadow:none;
		}
		& :global(.ProseMirror p:has(>br:only-child)::before){
			content:'Todo title';
			color:var(--bs-secondary-color);
			pointer-events:none /**Allows clicks through the editor.*/;
			float:left;
			height:0;
		}

		& :global(.ProseMirror p){
			margin-bottom:1rem;
		}
	}
</style>
