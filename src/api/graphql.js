import { API_URL } from '../constants';
import { throwError } from './error-handler';

let cache = {};

export const query = async ({ body, fetch, cacheable = true, bustCache = false }) => {
  if (bustCache) {
    cache = {};
  }

  const cached = cache[body];

  if (cacheable) {
    if (cached) {
      return cached;
    }
  }

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
    delete cache[body];
    return throwError({
      status: response.status,
      text: response.statusText,
      errors: [responseBody.error]
    });
  }

  if (cacheable) {
    cache[body] = responseBody;
  }

  return responseBody;
}
