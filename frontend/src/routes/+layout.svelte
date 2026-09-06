<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import MainLayout from '../components/Layout/Main.svelte';
	import "bootstrap/dist/css/bootstrap.min.css"
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<MainLayout {children}></MainLayout>
