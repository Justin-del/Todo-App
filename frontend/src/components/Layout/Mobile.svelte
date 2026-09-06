<script lang="ts">
	import type { Snippet } from "svelte";
    import MobileNavigation from "../Navigation/Mobile.svelte";
    const {children}:{children:Snippet<[]>} = $props();
</script>

<div>
    <main class="container">
        {@render children()}
    </main>

    <footer>
        <MobileNavigation />
    </footer>
</div>

<style>
    div{
        height:100svh;
        & footer{
           height:3rem;
           background-color: var(--bs-secondary-bg);
        }

        & main{
            height:calc(100% - 3rem);
        }
    }
</style>