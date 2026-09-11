<script lang="ts">
	import { onMount } from "svelte";
    import type {todo} from "../../../../shared_types_between_frontend_and_backend"
	import PageTitle from "../../components/PageTitle.svelte";
	import Todo from "../../components/Todo.svelte";
	import { authClient } from "$lib/AuthClient";
	import { goto } from "$app/navigation";
    /**
     * Generate fake todo data for now.
     */
    const todos:todo[] = $state([{id:crypto.randomUUID(),title:'This is a todo.', is_completed:true, created_at:new Date(), updated_at:new Date(),description:'This is the description of the todo.'},{id:crypto.randomUUID(),title:'Chiong Kai Yuan', is_completed:false, created_at:new Date(), updated_at:new Date(),description:'She has a sexy ass. I dream of fucking her butt.'},{id:crypto.randomUUID(),title:'Chiong Kai Yuan', is_completed:false, created_at:new Date(), updated_at:new Date(),description:'She has a sexy ass. I dream of fucking her butt.'}])  

    onMount(async()=>{
        const {data} = await authClient.getSession();
        const is_there_session = data?.session !== undefined;
        if (!is_there_session){
            goto("/login",{replaceState:true});
        }
    });

</script>

<div class="d-flex flex-column" style="height:90%;max-height:90%;">
    <PageTitle title="Todos"></PageTitle>
    <div class="flex-grow-1 overflow-auto">
        {#each todos as todo}
            <div class="d-contents mb-3">
                <Todo task={todo}></Todo>
            </div>
        {/each}
    </div>
    <button class="btn btn-primary" style="width:fit-content;">Add todo</button>
</div>



