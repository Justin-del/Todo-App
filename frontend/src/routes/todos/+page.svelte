<script lang="ts">
	import PageTitle from "../../components/PageTitle.svelte";
	import Todo from "../../components/Todo.svelte";
	import { getIsAuthPending, getIsLoggedIn} from "$lib/AuthClient.svelte";
	import { goto } from "$app/navigation";
	import { browser } from "$app/env";
	import { getTodos } from "../../api/client";
	import { onMount } from "svelte";
	import type { todo } from "../../types/todo";

    let todos:todo[] = $state([])

    onMount(async()=>{
        const response = await getTodos();
        if (response.status===200){
            const {todos:todos_from_server} = await response.json();
            todos = todos_from_server as {
                id:string;
                title:string;
                description:string;
                is_completed:0|1
            }[];
        }
    });
    
    $effect(()=>{
        if (!getIsAuthPending())
            if (browser && !getIsLoggedIn()){
                goto("/login",{replaceState:true})
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



