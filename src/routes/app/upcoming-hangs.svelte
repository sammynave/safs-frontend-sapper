<script context="module">
  import { getUpcomingHangs } from '../../queries/hangs';
  import { query } from '../../api/graphql';
  import { upcomingHangs, currentUser } from '../../stores';

  export async function preload() {
    const body = JSON.stringify({
      query: getUpcomingHangs
    });
    const result = await query({ fetch: this.fetch, body });
    upcomingHangs.set(result.data.upcomingHangs);
    currentUser.set(result.data.me);
    return { upcomingHangs, currentUser };
  }
</script>

<Title>
  Upcoming Hangs
</Title>

{#if $upcomingHangs}
  {#each $upcomingHangs as hang}
    <div>{hang.id} {hang.hangType.name} {hang.startAt} {hang.endAt}</div>
    <button on:click={() => yes(hang)}>yes</button>
    <button on:click={() => no(hang)}>no</button>
  {/each}
{/if}


<div>list hangs of types i'm subscribed to</div>


<script>
  import Title from '../../components/Title.svelte';

  export let upcomingHangs;
  export let currentUser;


  async function yes(hang) {
    const body = JSON.stringify({
      query: `mutation participateInHang($hangId: String!) {
        participateInHang(input: { hangId: $hangId }) {
          hangParticipant {
            id
          }
        }
      }`,
      variables: {
        hangId: hang.id
      }
    });

    const result = await query({ fetch, body });
    if (result.errors) {
      errors = result.errors;
      return;
    }
    console.log(result);
  }

  async function no(hang) {
    console.log('no');
    console.log(hang);
  }
</script>
