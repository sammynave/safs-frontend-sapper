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

<script>
  let username;
  let phone;
  let email;
  let password;
  let saving = false;

  $: createUserAccountMutation = `mutation {
        createUserAccount(input: {
          username: "${username}",
          phone: "${phone}",
          email: "${email}",
          password: "${password}"
        }) {
          user { id username }
          errors
        }
    }`;

  async function submit() {
    saving = true;
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: createUserAccountMutation
        })
      });
      const result = await response.json();
      const { data } = result
    } catch (ex) {
      console.log('parsing failed', ex)
    } finally {
      saving = false;
    }
  }
</script>
