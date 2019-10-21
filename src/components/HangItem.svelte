<div>
  <div>{hang.id} {hang.hangType.name}</div>
  <div>start: {displayStart}</div>
  <div>end {displayEnd}</div>
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

  const dateTimeOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric'
  };

  $: isGoing = hang.hangParticipants.some(x => x.user.username === username);
  $: displayStart = new Date(hang.startAt).toLocaleDateString('en-US', dateTimeOptions);
  $: displayEnd = new Date(hang.endAt).toLocaleDateString('en-US', dateTimeOptions);
</script>
