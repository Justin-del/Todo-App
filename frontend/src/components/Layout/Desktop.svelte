<script lang="ts">
	import type { Snippet } from "svelte";
    import DesktopNavigation from "../Navigation/Desktop.svelte";
     const {children}:{children:Snippet<[]>} = $props();
</script>

<header>
    <DesktopNavigation />
</header>

<main class="container">
    {@render children()}
</main>

<style>
    header{
        background-color: var(--bs-secondary-bg);
        height:3rem;
    }
</style>
