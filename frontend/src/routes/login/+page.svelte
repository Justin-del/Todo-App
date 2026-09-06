<script lang="ts">
	import { authClient } from "$lib/AuthClient";
	import { isValidEmailAddress } from "$lib/Email";
	import { getConnectionToServerFailureMessage } from "$lib/Messages";
	import SubmitButton from "../../components/Buttons/SubmitButton.svelte";

  let shouldShowPassword = $state(false);

  let email_address = $state('')
  let password = $state('');
  let form_element:HTMLFormElement;

  let error_message:string | undefined = $state(undefined);
  let is_submitting  = $state(false);

  const login = async()=>{
    error_message = '';

    if (!isValidEmailAddress(email_address)){
      error_message = 'Please provide a valid email address.'
      return;
    }

    if (!form_element.reportValidity()){
      return;
    }

    is_submitting = true;
    try {
      const {error}  = await authClient.signIn.email({
        email:email_address,
        password,
        callbackURL:'/'
      })
      error_message = error?.message;
    }catch(error){
      error_message = getConnectionToServerFailureMessage('login');
    }
    is_submitting = false;
  }
</script>

<h1 class="text-center">Login</h1>

<form bind:this={form_element}>
  <div class="mb-3">
    <label for="email-address" class="form-label">Email address</label>
    <input type="email" autocomplete="email" required={true} bind:value={email_address} class="form-control" id="email-address">
  </div>

  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input bind:value={password} required={true} type={shouldShowPassword?'text':'password'} class="form-control" id="password" autocomplete="current-password">
  </div>

  <div class="mb-3 form-check">
    <input bind:checked={shouldShowPassword} type="checkbox" class="form-check-input" id="show-password">
    <label class="form-check-label" for="show-password">Show password</label>
  </div>

  <SubmitButton onclick={login} class="btn btn-primary mb-3" text_when_submitting="Logging in" text_when_not_submitting="Log in" is_submitting={is_submitting} type="button"></SubmitButton>
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