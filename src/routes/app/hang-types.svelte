<script context="module">
  import { query } from '../../api/graphql';
  import { hangTypes, currentUser } from '../../stores';

  const getHangTypes = `
    {
      me {
        id,
        username
      }
      hangTypes {
        id,
        name,
        hangSubscriptions {
          user { username }
        }
    } }
  `;


  export async function preload() {
    const body = JSON.stringify({ query: getHangTypes });
    const result = await query({ fetch: this.fetch, body });

    hangTypes.set(result.data.hangTypes);
    currentUser.set(result.data.me);
    return { hangTypes, currentUser };
  }
</script>

<svelte:head>
  <title>Hang Types</title>
</svelte:head>

<h1>Hang Types</h1>

{#if $hangTypes}
  hang types
  {#each $hangTypes as hangType}
    <div>{hangType.name}
      {#if hangType.hangSubscriptions.map(x => x.user.username).includes($currentUser.username)}
        <button on:click={() => unsubscribeFrom(hangType.id)}>unsubscribe</button>
      {:else}
        <button on:click={() => subscribeTo(hangType.id)}>subscribe</button>
      {/if}
    </div>

    {#each hangType.hangSubscriptions as hs}
      <div>{hs.user.username}</div>
    {/each}
  {/each}
{/if}

<h2>add hang type</h2>
<form on:submit|preventDefault={createHangType}>
  <input type="text" bind:value={name} placeholder="name">
  <button type="submit">add</button>
</form>

<script>
  export let hangTypes;
  export let currentUser;

  let name = '';

  async function createHangType() {
    const body = JSON.stringify({
      query: `mutation createHang($name: String!){
        createNewHangType(input: { name: $name }) {
          hangType {
            id,
            name,
            hangSubscriptions {
              user { username }
            }
          }
        }
      }`,
      variables: {
        name
      }
    });

    const result = await query({ fetch, body });
    const { data: { createNewHangType: { hangType } } } = result;
    hangTypes.update(x => {
      return $hangTypes.concat([hangType])
    });
  }

  async function subscribeTo(hangTypeId) {
    const body = JSON.stringify({
      query: `mutation subscribeToHang($hangTypeId: String!) {
        subscribeToHangType(input: { hangTypeId: $hangTypeId }) {
          hangType {
            id,
            name,
            hangSubscriptions {
              user { username }
            }
          }
        }
      }`,
      variables: {
        hangTypeId
      }
    });

    const result = await query({ fetch, body });
    const { data: { subscribeToHangType: { hangType } } } = result;

    hangTypes.update(x => {
      return $hangTypes.map(y => y.id == hangType.id ? hangType : y)
    });
  }

  async function unsubscribeFrom(hangTypeId) {
    const body = JSON.stringify({
      query: `mutation unsubscribeFromHang($hangTypeId: String!) {
        unsubscribeFromHangType(input: { hangTypeId: $hangTypeId }) {
          hangType {
            id,
            name,
            hangSubscriptions {
              user { username }
            }
          }
        }
      }`,
      variables: {
        hangTypeId
      }
    });

    const result = await query({ fetch, body });
    const { data: { unsubscribeFromHangType: { hangType } } } = result;

    hangTypes.update(x => {
      return $hangTypes.map(y => y.id == hangType.id ? hangType : y)
    });
  }

  // TODO: get errors to show
  // $: errors = data && data.errors;
</script>
