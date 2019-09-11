<script context="module">

</script>
<style>
  form {
    max-width: 10em;
    font-size: 2rem;
    margin: auto;
  }

  input {
    width: 100%;
    font-size: 1.6rem;
  }
</style>

{#if saving}
  <div>saving</div>
{:else}
  <form on:submit|preventDefault={submit}>
    <div>create account</div>
    <input type="username" bind:value={username} placeholder="username"/>
    <input type="phone" bind:value={phone} placeholder="phone"/>
    <input type="email" bind:value={email} placeholder="email"/>
    <input type="password" bind:value={password} placeholder="password"/>
    <button type="submit">create</button>
  </form>
{/if}

<script>
  import ApolloClient from 'apollo-client';
  import { InMemoryCache } from 'apollo-cache-inmemory';
  import { HttpLink } from 'apollo-link-http';
  import { onError } from 'apollo-link-error';
  import { ApolloLink } from 'apollo-link';
  import gql from 'graphql-tag';
  import { onMount } from 'svelte';

  let client;
  onMount(() => {
    client = new ApolloClient({
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
          uri: 'http://localhost:3000/unauthenticated-graphql',
          fetch
        }),
      ]),
      cache: new InMemoryCache(),
    });
  });

  let username;
  let phone;
  let email;
  let password;

  let saving = false;
  $: createUserMutation = gql`mutation {
        createUser(input: {
          username: "${username}",
          phone: "${phone}",
          email: "${email}",
          password: "${password}"
        }) {
          user { id username }
          errors
        }
    }`;

  async function submit() {
    saving = true;
    try {
      const result = await client.mutate({
        mutation: createUserMutation
      });
      console.log(result);
      // TODO redirect to login
    } catch (ex) {
      console.log('parsing failed', ex)
    } finally {
      saving = false;
    }
  }
</script>
