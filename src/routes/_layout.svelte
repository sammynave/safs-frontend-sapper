<script>
  import Nav from '../components/Nav.svelte';
  export let segment;
</script>

<style>
  :global(html) { font-size: 62.5%; }

  :global(body) {
    margin: 0;
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 1.4rem;
    line-height: 1.5;
    color: #333;
  }

  :global(main) {
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  :global(h1, h2, h3, h4, h5, h6) {
    margin: 0 0 0.5em 0;
    font-weight: 400;
    line-height: 1.2;
  }

  :global(h1) {
    font-size: 2em;
  }

  :global(a) {
    color: inherit;
  }

  @media (min-width: 400px) {
    :global(body) {
      font-size: 2rem;
    }
  }
</style>

{#if segment === undefined}
  <Nav {segment}/>
{/if}

<slot></slot>
