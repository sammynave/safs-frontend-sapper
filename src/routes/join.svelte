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
    <div>create account</div>
    <input type="username" bind:value={username} placeholder="username"/>
    <input type="phone" bind:value={phone} placeholder="phone"/>
    <input type="email" bind:value={email} placeholder="email"/>
    <input type="password" bind:value={password} placeholder="password"/>
    <button type="submit">create</button>
  </form>
{/if}

<button on:click={gotoIndex}>index</button>
<script>
  import { stores, goto } from '@sapper/app';
  import { signup } from '../api/current-user';

  const { session } = stores();

  let username = '';
  let phone = '';
  let email = '';
  let password = '';
  let saving = false;

  function resetForm() {
    username = "",
    phone = "",
    email = "",
    password = ""
  }

  function gotoIndex(){
    return goto('/');
  }

  async function submit() {
    saving = true;

    try {
      await signup(session, { email, password, phone, username });
      resetForm();
      return goto('/');
    } catch (e) {
      throw e;
    } finally {
      saving = false;
    }
  }
</script>
