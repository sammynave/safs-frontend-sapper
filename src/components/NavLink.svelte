<style>
  li {
    display: block;
    float: left;
  }

  .selected {
    position: relative;
    display: inline-block;
  }

  .selected::after {
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255,62,0);
    display: block;
    bottom: -1px;
  }

  a, span {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
    cursor: pointer;
  }
</style>

<li class:selected>
  {#if click}
    <span role="button" on:click={click}>
      <slot></slot>
    </span>
  {:else}
    <a {rel} href={href}>
      <slot></slot>
    </a>
  {/if}
</li>

<script>
  export let selected = false;
  export let href = undefined;
  export let role = undefined;
  export let rel = "prefetch";
  export let click = undefined;
</script>
