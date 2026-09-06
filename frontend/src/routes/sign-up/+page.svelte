<script lang="ts">
	import { authClient } from "$lib/AuthClient";
	import { getConnectionToServerFailureMessage } from "$lib/Messages";
	import SubmitButton from "../../components/Buttons/SubmitButton.svelte";

  let shouldShowPassword = $state(false);

  let email_address = $state('')
  let password = $state('');

  let error_message:string | undefined = $state(undefined);
  let is_submitting  = $state(false);

  const sign_up = async()=>{
    error_message = '';
    is_submitting = true;
    try {
      const {error}  = await authClient.signUp.email({
        email:email_address,
        name:email_address,
        password,
        callbackURL:'/'
      })
      error_message = error?.message
    }catch(error){
      error_message = getConnectionToServerFailureMessage('sign up');
    }
    is_submitting = false;
  }
</script>

<h1 class="text-center">Sign Up</h1>
<form>
  <div class="mb-3">
    <label for="email-address" class="form-label">Email address</label>
    <input type="email" bind:value={email_address} class="form-control" id="email-address">
  </div>

  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input bind:value={password} type={shouldShowPassword?'text':'password'} class="form-control" id="password">
  </div>

  <div class="mb-3 form-check">
    <input bind:checked={shouldShowPassword} type="checkbox" class="form-check-input" id="show-password">
    <label class="form-check-label" for="show-password">Show password</label>
  </div>

  <SubmitButton onclick={sign_up} class="btn btn-primary mb-3" text_when_submitting="Signing up" text_when_not_submitting="Sign up" is_submitting={is_submitting}></SubmitButton>
</form>

{#if typeof error_message === 'string'}
  <div class="text-danger">
    {error_message}
  </div>
{/if}

<style>
  input{
    border:1px solid var(--bs-dark);
  }
</style>