<script context="module">
  import { query } from '../../api/graphql';
  import { hangTypes, eligibleHangs, myHangs, currentUser } from '../../stores';

  const getHangTypes = `
    query getMyHangs($startBefore: ISO8601DateTime, $startAfter: ISO8601DateTime){
      me {
        id,
        username
      }
      eligibleHangs(startBefore: $startBefore, startAfter: $startAfter) {
        id,
        startAt,
        endAt,
        hangParticipants {
          id,
          user { username }
        }
        hangType {
          name,
          hangSubscriptions {
            user { username }
          }
        }
      }
      myHangs(startBefore: $startBefore, startAfter: $startAfter) {
        id,
        startAt,
        endAt,
        hangParticipants {
          id,
          user { username }
        }
        hangType {
          name,
          hangSubscriptions {
            user { username }
          }
        }
      }
      hangTypes {
        id,
        name,
        hangSubscriptions {
          user { username }
        }
    } }
  `;

  const today = new Date();

  export async function preload() {
    const body = JSON.stringify({
    query: getHangTypes,
    variables: {
      startAfter: today.toISOString()
    }
    });
    const result = await query({ fetch: this.fetch, body });
    hangTypes.set(result.data.hangTypes);
    myHangs.set(result.data.myHangs);
    eligibleHangs.set(result.data.eligibleHangs);
    currentUser.set(result.data.me);
    return { hangTypes, eligibleHangs,  myHangs, today, currentUser };
  }
</script>

<svelte:head>
  <title>Hangs</title>
</svelte:head>

<h1>Hangs</h1>

<h1>SHOW ALL HANGS THAT CAN BE PARTICIPATED IN</h1>
<h1>THEN YES/NO TO CREATE PARTICIPATION RECORD</h1>

{#if $eligibleHangs}
  {#each $eligibleHangs as hang}
    <div>{hang.id} {hang.hangType.name} {hang.startAt} {hang.endAt}</div>
    <button on:click={() => yes(hang)}>yes</button>
    <button on:click={() => no(hang)}>no</button>
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

<h2>my hangs</h2>
{#if $myHangs}
  {#each $myHangs as myHang}
    <div>{myHang.id} {myHang.hangType.name} {myHang.startAt} {myHang.endAt}</div>
    {#each myHang.hangType.hangSubscriptions as subs}
      <div>{subs.user.username}</div>
    {/each}
  {/each}
{/if}

<script>
  export let hangTypes;
  export let myHangs;
  export let eligibleHangs;
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

  async function yes(hang) {
    if (!isValid()) {
      return;
    };

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
