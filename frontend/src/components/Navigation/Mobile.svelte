<script>
	import { goto } from "$app/navigation";
	import { authClient, getIsLoggedIn } from "$lib/AuthClient.svelte";

</script>

{#if getIsLoggedIn()}
  <nav class="nav justify-content-around">
        <a class="nav-link text-dark" href="/todos">Todos</a>
        <button class="nav-link text-dark" onclick={()=>{
          authClient.signOut({
            fetchOptions:{
              onSuccess:()=>{
                goto("/login",{replaceState: true});
              }
            }
          });
        }}>Log out</button>
  </nav>
{/if}
