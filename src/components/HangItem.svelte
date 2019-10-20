<div>
  <div>{hang.id} {hang.hangType.name} {displayStart} {displayEnd}</div>
  You are: {isGoing ? 'Going' : 'Not going'}
  change to
  {#if isGoing}
    <button on:click={no}>
      change to Not going
    </button>
  {:else}
    <button on:click={yes}>
      Going
    </button>
  {/if}
</div>

<script>
  export let hang;
  export let yes;
  export let no;
  export let username;

  $: isGoing = hang.hangParticipants.some(x => x.user.username === username);
  $: displayStart = hang.startAt;
  $: displayEnd = hang.endAt;
</script>
