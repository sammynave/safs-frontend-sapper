<script context="module">
  export async function preload(page, session) {
    if(session.signedIn) {
      return this.redirect(302, '/');
    }
  }
</script>

<script>
  import Nav from '../../components/Nav.svelte';

  export let segment;
</script>

<Nav {segment}/>

<main>
  <slot></slot>
</main>
