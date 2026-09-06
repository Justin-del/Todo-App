<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import "bootstrap/dist/css/bootstrap.min.css"
	import DesktopNavigation from '../components/Navigation/Desktop.svelte';
	import MobileNavigation from '../components/Navigation/Mobile.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div>
	<header>
		<DesktopNavigation></DesktopNavigation>
	</header>

	<main class="container">
		{@render children()}
	</main>

	<footer>
		<MobileNavigation></MobileNavigation>
	</footer>
</div>

<style>
	div{
        height:100svh;
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
			height:var(--navigation-height);
			background-color: var(--navigation-background-color);
		}
		

        & main{
            height:calc(100% - var(--navigation-height));
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