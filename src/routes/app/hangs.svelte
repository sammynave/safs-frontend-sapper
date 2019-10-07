<script context="module">
  import { query } from '../../api/graphql';
  import { hangTypes, myHangs } from '../../stores';

  const getHangTypes = `
    {
      myHangs {
        id,
        startAt,
        endAt
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
    myHangs.set(result.data.myHangs);
    return { hangTypes, myHangs };
  }
</script>

<svelte:head>
  <title>Hangs</title>
</svelte:head>

<h1>Hangs</h1>

<h2>create a hang</h2>
<form on:submit|preventDefault={createHang}>
  <select bind:value={selectedId}>
    {#if $hangTypes}
      <option value=''>
        Select a hang type
      </option>
      {#each $hangTypes as hangType}
        <option value={hangType.id}>
          {hangType.name}
        </option>
      {/each}
    {/if}
  </select>

  <button disabled={!selectedId} type="submit">create</button>
</form>

<h2>my hangs</h2>
<h1>TODO return `myHangs` when creating a new hang</h1>
{#if $myHangs}
  {#each $myHangs as myHang}
    <div>{myHang.id}</div>
  {/each}
{/if}

<script>
  export let hangTypes;
  export let myHangs;

  let selectedId;
  let startAt = new Date();
  let endAt = new Date();;

  async function createHang() {
    const body = JSON.stringify({
      query: `mutation createHang($hangTypeId: String!, $startAt: ISO8601DateTime!, $endAt: ISO8601DateTime!){
        createHang(input: { hangTypeId: $hangTypeId, startAt: $startAt, endAt: $endAt }) {
          hang {
            id,
            startAt,
            endAt
          },
        }
      }`,
      variables: {
        hangTypeId: selectedId,
        startAt,
        endAt
      }
    });

    const result = await query({ fetch, body });
  }
</script>
