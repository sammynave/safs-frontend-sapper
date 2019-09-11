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
  let email;
  let password;

  let saving = false;

function submit() {
  saving = true;
  fetch('http://localhost:3000/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  }).then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log('parsed json', json)
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    }).finally(function() {
      saving = false;
    })
}
</script>
