<script>
  import Nav from '../components/Nav.svelte';
  export let segment;
</script>

<style>
</style>

{#if segment === undefined}
  <Nav {segment}/>
{/if}

<slot></slot>
