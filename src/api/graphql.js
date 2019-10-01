import { API_URL } from '../constants';
import { throwError } from './error-handler';

export const query = async ({ body, fetch }) => {
  const response = await fetch(`${API_URL}/graphql.json`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body
  });

  const responseBody = await response.json();

  if (!response.ok) {
    return throwError({
      status: response.status,
      text: response.statusText,
      errors: [responseBody.error]
    });
  }

  return responseBody;
}
