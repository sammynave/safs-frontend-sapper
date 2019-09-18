<script context="module">
  import { query } from '../api/graphql';
  import { hangTypes } from '../stores';

  export async function preload() {
    const body = JSON.stringify({ query: `{ hangTypes { id, name, hangSubscriptions
{ user { username } } } }` });
    const result = await query({ fetch: this.fetch, body });
    hangTypes.set(result.data.hangTypes);
    return { hangTypes };
  }
</script>

<svelte:head>
  <title>Users</title>
</svelte:head>

<h1>Users</h1>

<p>This is the 'users' page. There's not much here.</p>

{#if $hangTypes}
  hang types
  {#each $hangTypes as hangType}
    <div>{hangType.name}
      <button on:click={() => subscribeTo(hangType.id)}>subscribe</button>
    </div>

    {#each hangType.hangSubscriptions as hs}
      <div>{hs.user.username}</div>
    {/each}
  {/each}
{/if}


<script>
  export let hangTypes;

  async function subscribeTo(hangTypeId) {
    const body = JSON.stringify({
      query: `mutation {
        subscribeToHangType(input: { hangTypeId: "${hangTypeId}" }) {
          hangType {
            id,
            name,
            hangSubscriptions {
              user { username }
            }
          }
        }
      }`
    });

    const result = await query({ fetch, body });
    const { data: { subscribeToHangType: { hangType } } } = result;

    hangTypes.update(x => {
      return $hangTypes.map(y => y.id == hangType.id ? hangType : y)
    });
  }

  // TODO: get errors to show
  // $: errors = data && data.errors;
</script>
