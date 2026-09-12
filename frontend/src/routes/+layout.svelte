<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import "bootstrap/dist/css/bootstrap.min.css"
	import DesktopNavigation from '../components/Navigation/Desktop.svelte';
	import MobileNavigation from '../components/Navigation/Mobile.svelte';
	import { getIsLoggedIn } from '$lib/AuthClient.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="d-flex flex-column">
	<header>
		<DesktopNavigation></DesktopNavigation>
	</header>

	<main class="container flex-grow-1">
		{@render children()}
	</main>

	{#if getIsLoggedIn()}
		<footer>
			<MobileNavigation></MobileNavigation>
		</footer>
	{/if}
</div>

<style>
	main{
		min-height:0;
	}
	
	div{
        height:100svh;
		padding-top:env(safe-area-inset-top, 0px);
		padding-left:env(safe-area-inset-left, 0px);
		padding-right:env(safe-area-inset-right, 0px);
		--navigation-height:3rem;
		--navigation-background-color:var(--bs-secondary-bg);

		/**
			Hide header on mobile.
		*/
		& header{
			display:none;
		}

		/* 
		Show footer on mobile.
		*/
		& footer{
			box-sizing:content-box;
			height: var(--navigation-height);
    		padding-bottom: env(safe-area-inset-bottom, 0px);
    		background-color: var(--navigation-background-color);
		}
		
		/**
		Desktop specific styles
		*/
		@media screen and (width>=576px){
			header{
				display:block;
				background-color: var(--navigation-background-color);
        		height:var(--navigation-height);
			}

			footer{
				display:none;
			}
		}
    }
</style>