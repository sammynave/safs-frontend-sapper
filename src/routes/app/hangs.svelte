<script context="module">
  import { query } from '../../api/graphql';
  import { hangTypes, myHangs, currentUser } from '../../stores';
  import { getMyHangs } from '../../queries/hangs';

  const today = new Date();

  export async function preload() {
    const body = JSON.stringify({
      query: getMyHangs,
      variables: {
        startAfter: today.toISOString()
      }
    });
    const result = await query({ fetch: this.fetch, body });
    hangTypes.set(result.data.hangTypes);
    myHangs.set(result.data.myHangs);
    currentUser.set(result.data.me);
    return { hangTypes,  myHangs, today, currentUser };
  }
</script>

<svelte:head>
  <title>Hangs</title>
</svelte:head>

<h1>My Hangs</h1>

{#if $myHangs}
  {#each $myHangs as myHang}
    <div>{myHang.id} {myHang.startAt} {myHang.endAt}</div>
    {#each myHang.hangType.hangSubscriptions as subs}
      <div>{subs.user.username}</div>
    {/each}
  {/each}
{/if}

<h2>create a hang</h2>

{#each errors as error}
  <div>{error.message}</div>
{/each}

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

  <div>
    Start At
    <input type="date" bind:value={startAtDay}/>
    <input type="time" bind:value={startAtTime}/>
  </div>

  <div>
    End At
    <input type="date" bind:value={endAtDay}/>
    <input type="time" bind:value={endAtTime}/>
  </div>

  <button disabled={!selectedId} type="submit">create</button>
</form>

<script>
  export let hangTypes;
  export let myHangs;
  export let currentUser;
  export let today;

  const dateFormat = '#{Y}-#{m}-#{d}';
  let selectedId;
  let startAtDay = todayString();
  let endAtDay = todayString();
  let startAtTime = nowString();
  let endAtTime = nowString();
  let startAtChosen = false;
  let endAtChosen = false;
  let errors = [];

  function reset() {
    selectedId;
    startAtDay = todayString();
    endAtDay = todayString();
    startAtTime = nowString();
    endAtTime = nowString();
    startAtChosen = false;
    endAtChosen = false;
    errors = [];
  }

  function nowString() {
    const t = new Date() ;
    const hours = t.getHours();
    const minutes = t.getMinutes();
    const displayHours = hours < 10 ? `0${hours}` : hours;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes}`;
  }
  function todayString() {
    return `${todayMidnight().toISOString().split('T')[0]}`;
  }

  function todayMidnight() {
    const t = new Date() ;
    return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()));
  }

  function isInFuture() {
    return Date.parse(startAtDay) >= todayMidnight();
  }

  function formatDate(day, time = '00:00') {
    return `${day}T${time}:00Z`
  }

  $: if (
    typeof endAtDay === 'undefined' &&
    typeof startAtDay !== 'undefined' &&
    isInFuture()) {
    endAtDay = startAtDay;
  }

  $: startAt, endAt, selectedId, errors = [];
  $: startAt = formatDate(startAtDay, startAtTime);
  $: endAt = formatDate(endAtDay, endAtTime);

  function isValid() {
    let endsAfterStart = false;
    let inFuture = isInFuture();
    let newErrors = errors;

    if (Date.parse(startAt) <= Date.parse(endAt)) {
      endsAfterStart = true;
    } else {
      newErrors.push({ message: 'end date must be after start date' });
    }

    if (!inFuture) {
      newErrors.push({ message: 'start date must be in the future' });
    }

    errors = newErrors;
    return endsAfterStart && inFuture;
  }

  async function createHang() {
    if (!isValid()) {
      return;
    };

    const body = JSON.stringify({
      query: `mutation createHang($hangTypeId: String!, $startAt: ISO8601DateTime!, $endAt: ISO8601DateTime!){
        createHang(input: { hangTypeId: $hangTypeId, startAt: $startAt, endAt: $endAt}) {
          hang {
            id
          }
          myHangs {
            id,
            startAt,
            endAt
          }
        }
      }`,
      variables: {
        hangTypeId: selectedId,
        startAt,
        endAt
      }
    });

    const result = await query({ fetch, body });
    if (result.errors) {
      errors = result.errors;
      return;
    }
    myHangs.set(result.data.createHang.myHangs);
    reset();
  }
</script>
