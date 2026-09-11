<script>
	import { goto } from "$app/navigation";
	import { authClient, getIsLoggedIn } from "$lib/AuthClient.svelte";

</script>
<nav class="nav">
  {#if getIsLoggedIn()}
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
  {:else}
    <a class="nav-link text-dark"  href="/sign-up">Sign Up</a>
    <a class="nav-link text-dark" href="/login">Login</a>
  {/if}
</nav>


<style>
  a:hover, button:hover{
    text-decoration-line: underline;
  }
</style>