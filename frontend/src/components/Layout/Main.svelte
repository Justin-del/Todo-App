<script lang="ts">
	import DesktopLayout from "./Desktop.svelte";
	import MobileLayout from "./Mobile.svelte";
	import {getIsMobileView} from "$lib/MobileView.svelte";
	import type { Snippet } from "svelte";
	const {children}:{children:Snippet<[]>} = $props();
</script>

{#if getIsMobileView()}
    <MobileLayout {children}></MobileLayout>
{:else}
    <DesktopLayout {children}></DesktopLayout>
{/if}