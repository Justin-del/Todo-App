<script lang="ts">
	import { authClient } from "$lib/AuthClient";
	import { getConnectionToServerFailureMessage } from "$lib/Messages";

  let shouldShowPassword = $state(false);

  let email_address = $state('')
  let password = $state('');

  let error_message:string | undefined = $state(undefined);
  const signUp = async()=>{
    error_message = '';
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

  <button type="submit" class="btn btn-primary mb-3" onclick={signUp}>Sign Up</button>
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