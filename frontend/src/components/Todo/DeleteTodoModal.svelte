<script lang="ts">
	import type { Modal } from 'bootstrap';
	import { onMount } from 'svelte';

	const {
		todo_title,
		onDelete,
		onCancel
	}: { todo_title: string; onDelete: () => void; onCancel: () => void } = $props();
	let modal_element: HTMLDivElement;

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
			<div class="modal-header">
				<h5 class="modal-title">Delete Todo?</h5>
				<button type="button" class="btn-close" aria-label="Close" onclick={onCancel}></button>
			</div>
			<div class="modal-body">
				<p>Delete todo <strong>{todo_title}</strong>? This action cannot be undone.</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" onclick={onCancel}>Cancel</button>
				<button type="button" class="btn btn-danger" onclick={onDelete}>Delete</button>
			</div>
		</div>
	</div>
</div>
