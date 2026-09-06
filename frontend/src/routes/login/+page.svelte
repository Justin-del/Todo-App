<script lang="ts">
	import { authClient } from "$lib/AuthClient";

  let shouldShowPassword = $state(false);

  let email_address = $state('')
  let password = $state('');

  let error_message:string | undefined = $state(undefined);
  const login = async()=>{
    error_message = '';
    const {error}  = await authClient.signIn.email({
      email:email_address,
      password,
      callbackURL:'/'
    })
    error_message = error?.message
  }
</script>

<h1 class="text-center">Login</h1>
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

  <button type="submit" class="btn btn-primary" onclick={login}>Submit</button>
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