export const NOT_AUTHORIZED = 'Not Authorized';

export const throwError = ({ text, errors, status }) => {
  throw Error(JSON.stringify({ text, errors, status }));
}
