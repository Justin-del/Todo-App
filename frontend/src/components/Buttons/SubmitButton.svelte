<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';

    type CustomButtonProps = {
        is_submitting:boolean;
        text_when_submitting:string;
        text_when_not_submitting:string;
    }

    type Props = HTMLButtonAttributes & CustomButtonProps;

    let {is_submitting,text_when_submitting, text_when_not_submitting,...restProps}:Props = $props();
</script>


<button {...restProps}>
    {#if is_submitting}
        <div class="spinner-border spinner-border-sm d-inline-block me-1 text-light" aria-hidden="true">
        </div>
    {/if}
    <div class="d-inline-block">
        {#if is_submitting}
            {text_when_submitting}
        {:else}
            {text_when_not_submitting}
        {/if}
    </div>
</button>