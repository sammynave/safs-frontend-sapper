<script context="module">
  export async function preload(page, session) {
    if(session.signedIn) {
      return this.redirect(302, '/');
    }
  }
</script>

<style>
  form {
    max-width: 10em;
    font-size: 2rem;
    margin: auto;
  }

  input {
    width: 100%;
    font-size: 1.6rem;
  }
</style>

{#if saving}
  <div>saving</div>
{:else}
  <form on:submit|preventDefault={submit}>
    <div>sign in</div>
    <input type="email" bind:value={email} placeholder="email"/>
    <input type="password" bind:value={password} placeholder="password"/>
    <button type="submit">create</button>
  </form>
{/if}

<script>
  import { stores, goto } from '@sapper/app';
  import { login } from '../api/current-user';

  const { session } = stores();

  let email = '';
  let password = '';

  let saving = false;

  let errorMessage = '';
  let errors = [];

  function resetForm() {
    email = '';
    password = '';
  }

  async function submit() {
    saving = true;
    errorMessage = '';
    errors = [];
    try {
      await login(session, { password, email });
      resetForm();
      return goto('/');
    } catch (e) {
      const error = JSON.parse(e.message);
      errors = error.errors && error.errors.length ? error.errors : [error.statusText];
      console.log('error in routes/login.svelte');
      console.log(e);
      throw(e);
    } finally {
      saving = false;
    }
  }
</script>
