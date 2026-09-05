<script>
    import MobileNavigation from "../Navigation/Mobile.svelte";
</script>


<div>
    <main>
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