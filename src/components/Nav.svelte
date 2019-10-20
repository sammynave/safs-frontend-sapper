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

</style>

<script>
  import { stores, goto } from '@sapper/app';
  import { logout } from '../api/current-user';
  import NavLink from './NavLink.svelte';

  export let segment;
  const { session } = stores();

  function handleLogout() {
    logout(session);
    return goto('/auth/join');
  }
</script>

<nav>
  <ul>
    <NavLink selected={segment === undefined} href='.'>
      home
    </NavLink>

    {#if $session.signedIn}
      <NavLink selected={segment === "upcoming-hangs" ? "selected" : ""} href='app/upcoming-hangs'>
        upcoming hangs
      </NavLink>
      <NavLink selected={segment === "users" ? "selected" : ""} href='app/users'>
        users
      </NavLink>
      <NavLink selected={segment === "hangs" ? "selected" : ""} href='app/hangs'>
        hangs
      </NavLink>
      <NavLink selected={segment === "hang-types" ? "selected" : ""} href='app/hang-types'>
        hang types
      </NavLink>
      <NavLink click={handleLogout}>
        logout
      </NavLink>
    {:else}
      <NavLink selected={segment === "join" ? "selected" : ""} href='auth/join'>
        join
      </NavLink>
      <NavLink selected={segment === "login" ? "selected" : ""} href='auth/login'>
        login
      </NavLink>
    {/if}
  </ul>
</nav>
