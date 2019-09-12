<style>
  nav {
    border-bottom: 1px solid rgba(255,62,0,0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

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
  }
</style>

<script>
  import { stores, goto } from '@sapper/app';
  import { logout } from '../api/current-user';

  export let segment;
  const { session } = stores();

  function handleLogout() {
    logout(session);
    return goto('/join');
  }
</script>

<nav>
  <ul>
    {#if $session.signedIn}
      <li><a rel=prefetch class='{segment === undefined ? "selected" : ""}' href='.'>home</a></li>
      <li><a rel=prefetch class='{segment === "users" ? "selected" : ""}' href='users'>users</a></li>
      <li><a rel=prefetch class='{segment === "blog" ? "selected" : ""}' href='blog'>blog</a></li>
      <li><span role="button" on:click={handleLogout}>logout</span></li>
    {:else}
      <li><a rel=prefetch class='{segment === "join" ? "selected" : ""}' href='join'>join</a></li>
      <li><a rel=prefetch class='{segment === "login" ? "selected" : ""}' href='login'>login</a></li>
    {/if}
  </ul>
</nav>
