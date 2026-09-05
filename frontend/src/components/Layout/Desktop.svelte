<script>
	import { browser } from "$app/env";
    import DesktopNavigation from "../Navigation/Desktop.svelte";
    if (browser){
        import('bootstrap');
    }
</script>

<header>
    <DesktopNavigation />
</header>

<main>
</main>

<style>
    header{
        background-color: var(--bs-secondary-bg);
        height:3rem;
    }
</style>
