<script context="module">
  import { NOT_AUTHORIZED } from '../api/error-handler';
  import { query } from '../api/graphql';

  export async function preload(page, session) {
    if(!session.signedIn) {
      return this.redirect(302, '/join');
    }

    try {
      const body = JSON.stringify({ query: `{ users { username } }`});
      const response = await query({ body, fetch: this.fetch });
      return response;
    } catch (e) {
      console.log('error! in index.svelte');
      console.log(e);
      const error = JSON.parse(e.message);
      if (error.statusText === NOT_AUTHORIZED) {
          const response = logout(session);
          return this.redirect(302, '/join');
      }
    }
  }
</script>

<style>
</style>

<svelte:head>
  <title>SAFS</title>
</svelte:head>

{#each users as user}
  <div>{user.username}</div>
{/each}

<script>
  export let data;
  let users;

  $: users = data.users || [];
</script>
