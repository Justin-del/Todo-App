<script>
	import DesktopLayout from "./Desktop.svelte";
	import MobileLayout from "./Mobile.svelte";
	import {getIsMobileView} from "$lib/MobileView.svelte";
</script>

{#if getIsMobileView()}
    <MobileLayout/>
{:else}
    <DesktopLayout />
{/if}