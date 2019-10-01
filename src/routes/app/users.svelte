<script context="module">
  // This set up prevents loading data too often.
  // we preload it once, keep track with count. then
  // pass a users store around. we could write some
  // logic around when to refresh this data. for now
  // there's a refresh button
  import { query } from '../../api/graphql';
  import { logout } from '../../api/current-user';
  import { users } from '../../stores';
  import { writable } from 'svelte/store';

  export const count = writable(0);
  let countValue;

  export async function preload(_, session) {
    let unsubscribe = count.subscribe(v => (countValue = v));
    if (countValue > 0) {
      unsubscribe();
      return { count, users };
    }
    count.update(n => n + 1);
    const body = JSON.stringify({ query: `{ users { username } }` });
    try {
      const result = await query({ fetch: this.fetch, body });
      users.set(result.data.users);
      return { users, count };
    } catch (e) {
      logout(session);

      return this.redirect(302, 'auth/join');
    }
  }
</script>

<svelte:head>
  <title>Users</title>
</svelte:head>

<h1>what</h1>
<h1>Users</h1>

<p>This is the 'users' page. There's not much here.</p>

<div>
  {#if $users}
    users
    {#each $users as user}
      <div>user - {user.username}</div>
    {/each}
  {/if}

  {$count}
  <button on:click={handleRefresh}>refresh</button>
</div>
<script>
  export let count;
  export let users;

  async function handleRefresh() {
    count.update(n => n + 1);
    const body = JSON.stringify({ query: `{ users { username } }` });
    const result = await query({ fetch: fetch, body });
    users.set(result.data.users);
  }

  // TODO: get errors to show
  // $: errors = data && data.errors;
</script>
