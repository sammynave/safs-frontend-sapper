<script context="module">
  import { query } from '../../api/graphql';
  import { logout } from '../../api/current-user';
  import { users } from '../../stores';
  import { writable } from 'svelte/store';

  export async function preload(_, session) {
    const body = JSON.stringify({ query: `{ users { username } }` });
    try {
      const result = await query({ fetch: this.fetch, body });
      users.set(result.data.users);
      return { users };
    } catch (e) {
      logout(session);

      return this.redirect(302, 'auth/join');
    }
  }
</script>

<svelte:head>
  <title>Users</title>
</svelte:head>

<h1>Users</h1>

<p>This is the 'users' page. There's not much here.</p>

<div>
  {#if $users}
    users
    {#each $users as user}
      <div>user - {user.username}</div>
    {/each}
  {/if}
</div>
<script>
  export let users;

  // TODO: get errors to show
  // $: errors = data && data.errors;
</script>
