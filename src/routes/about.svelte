<script context="module">
  let token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozLCJleHAiOjE1NjgxNjc2NTl9.OGmr4aeEljHJ1SQDogaZYTlkcOmoODwyMh57Eye3N2s';

  export async function preload() {

    let query = `{ users { username } }`;

      const response = await this.fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `bearer ${token}`,
        },
        body: JSON.stringify({
          query
        })
      });

      const result = await response.json();
      return { data: result.data } = result;
    }
</script>

<svelte:head>
  <title>About</title>
</svelte:head>

<h1>About this site</h1>

<p>This is the 'about' page. There's not much here.</p>

{#if users}
  users
  {#each users as user}
    <div>user - {user.username}</div>
  {/each}
{/if}

{#if errors}
  {#each errors as error}
    <div>{error.message}</div>
  {/each}
{/if}

<script>
  export let data;
  $: errors = data && data.errors;
  $: users = data && data.users;
</script>
