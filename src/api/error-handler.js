export const NOT_AUTHORIZED = 'Not Authorized';

export const throwError = (statusText, errors) => {
  throw Error(JSON.stringify({ statusText, errors }));
}
