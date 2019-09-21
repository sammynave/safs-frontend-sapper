import { API_URL } from '../constants';
import { throwError, NOT_AUTHORIZED } from './error-handler';

export const setCurrentUser = (sessionStore, { signedIn }) => {
  if (sessionStore.set) {
    sessionStore.set({ signedIn });
  } else {
    sessionStore.signedIn = signedIn;
  }

  if (localStorage) {
    localStorage.signedIn = signedIn;
  }
}

export const clearCurrentUser = (sessionStore) => {
  if (sessionStore.set) {
    sessionStore.set({ signedIn: false });
  } else {
    sessionStore.signedIn = false;
  }

  if (typeof localStorage !== 'undefined') {
    delete localStorage.signedIn;
  }
}

export const logout = (sessionStore) => {
  clearCurrentUser(sessionStore);
}

const post = (url, body) => fetch(url, {
  method: 'POST',
  mode: 'cors',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});

export const login = async (sessionStore, body) => {
  const response = await post(`${API_URL}/authentication.json`, { auth: body });

  let responseBody = {};
  if (response.bodyUsed) {
    responseBody = await response.json();
  }

  if (!response.ok) {
    return throwError(response, responseBody);
  }

  setCurrentUser(sessionStore, { ...responseBody, signedIn: true });
}

export const signup = async (sessionStore, body) => {
  const response = await post(`${API_URL}/user_signups.json`, { user: body });

  let responseBody = {};
  if (response.bodyUsed) {
    responseBody = await response.json();
  }

  if (!response.ok) {
    responseBody = await response.json();
    return throwError(response.statusText, responseBody);
  }

  setCurrentUser(sessionStore, { ...responseBody, signedIn: true });
}
