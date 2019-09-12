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

export const login = async (sessionStore, body) => {
  const response = await fetch(`${API_URL}/authentication.json`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ auth: body })
  });

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
  const response = await fetch(`${API_URL}/user_signups.json`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: body })
  });

  const auth = await response.json();

  if (!response.ok) {
    return throwError(response.statusText, auth.errors);
  }

  setCurrentUser(sessionStore, { ...auth, signedIn: true });
}
