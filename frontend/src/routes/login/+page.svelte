<script lang="ts">
  let shouldShowPassword = $state(false);
</script>

<h1 class="text-center">Login</h1>
<form>
  <div class="mb-3">
    <label for="email-address" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email-address">
  </div>

  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type={shouldShowPassword?'text':'password'} class="form-control" id="password">
  </div>

  <div class="mb-3 form-check">
    <input bind:checked={shouldShowPassword} type="checkbox" class="form-check-input" id="show-password">
    <label class="form-check-label" for="show-password">Show password</label>
  </div>

  <button type="submit" class="btn btn-primary">Submit</button>
</form>

<style>
  input{
    border:1px solid var(--bs-dark);
  }
</style>