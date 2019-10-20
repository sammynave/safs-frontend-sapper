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
  {#each orderedUpcomingHangs as hang}
    <HangItem
      hang="{hang}"
      yes="{() => yes(hang)}"
      no="{() => no(hang)}"
      username="{$currentUser.username}"/>
  {/each}
{/if}

<script>
  import Title from '../../components/Title.svelte';
  import HangItem from '../../components/HangItem.svelte';
  import {
    participateInHang,
    declineToParticipateInHang
  } from '../../mutations/hangs';

  export let upcomingHangs;
  export let currentUser;

  $: orderedUpcomingHangs = $upcomingHangs.sort((x,y) => new Date(x.startAt) - new Date(y.startAt));

  async function yes(hang) {
    const body = JSON.stringify({
      query: participateInHang,
      variables: {
        hangId: hang.id
      }
    });

    const result = await query({ fetch, body, cacheable: false });
    if (result.errors) {
      errors = result.errors;
      return;
    }
    upcomingHangs.set(result.data.participateInHang.upcomingHangs);
  }

  async function no(hang) {
    const body = JSON.stringify({
      query: declineToParticipateInHang,
      variables: {
        hangId: hang.id
      }
    });

    const result = await query({ fetch, body, cacheable: false });
    if (result.errors) {
      errors = result.errors;
      return;
    }
    upcomingHangs.set(result.data.declineToParticipateInHang.upcomingHangs);
  }
</script>
