<script context="module">
  import ApolloClient from 'apollo-client';
  import { InMemoryCache } from 'apollo-cache-inmemory';
  import { HttpLink } from 'apollo-link-http';
  import { onError } from 'apollo-link-error';
  import { ApolloLink } from 'apollo-link';
  import gql from 'graphql-tag';

  let token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozLCJleHAiOjE1NjgxNjc2NTl9.OGmr4aeEljHJ1SQDogaZYTlkcOmoODwyMh57Eye3N2s';
  export function preload() {
    const fetch = this.fetch;
    const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      new HttpLink({
        uri: 'http://localhost:3000/graphql',
        headers: {
          'Authorization': `bearer ${token}`
        },
        fetch
      })
    ]),
    cache: new InMemoryCache(),

    ssrMode: true
  });

    console.log('about');
    return client.query({
      query: gql`{
        hangs {
          owner {
            id
            username
          }
          hangType {
            id
            name
          }
          hangParticipants {
            id
          }
        }
      }`
    }).then((result) => {

    return result;
});
  }
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<h1>About this site</h1>

<p>This is the 'about' page. There's not much here.</p>

hangs
{#if hangs}
{#each hangs as hang}
  <div>user - {hang.owner.username}</div>
{/each}
{/if}

<script>

export let data;

  $: hangs = data && data.hangs;
</script>
