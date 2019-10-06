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

<main>
  <h1>create account</h1>
  <div>
    {#if saving}
      <div>saving</div>
    {:else}
      <form on:submit|preventDefault={submit}>
        <input type="username" bind:value={username} placeholder="username"/>
        <input type="phone" bind:value={phone} placeholder="phone"/>
        <input type="email" bind:value={email} placeholder="email"/>
        <input type="password" bind:value={password} placeholder="password"/>
        <button type="submit">create</button>
      </form>
    {/if}

    {#each errors as error}
      <div>{error}</div>
    {/each}
  </div>
</main>

<script>
  import { stores, goto } from '@sapper/app';
  import { signup } from '../../api/current-user';

  const { session } = stores();

  let errors = [];
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
      const error = JSON.parse(e.message);
      errors = error.errors && error.errors.length ? error.errors : [error.statusText];
      throw e;
    } finally {
      saving = false;
    }
  }
</script>
