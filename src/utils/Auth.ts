const AUTH_TOKEN_KEY = "mkw-auth-token";
const AUTH_TOKEN_EXPIRY_KEY = "mkw-auth-token-expiry";

/** Set the authentication token to be included with every request.
 *
 * @param token The token returned from a successful login.
 */
export const setToken = (token: string, expiry: string) => {
  if (Number.isNaN(Date.parse(expiry))) {
    throw TypeError("Expiry is not a valid date");
  }
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_TOKEN_EXPIRY_KEY, expiry);
};

/** The authentication token to be included with every request. */
export const getToken = () => {
  return isAuthenticated() ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
};

/** Clear the authentication token. */
export const clearToken = () => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_EXPIRY_KEY);
};

/** Whether the user is authenticated. */
export const isAuthenticated = () => {
  const expiry = window.localStorage.getItem(AUTH_TOKEN_EXPIRY_KEY);
  if (expiry === null) {
    return false;
  }
  if (Date.parse(expiry) <= Date.now()) {
    // TODO: actually log user out
    clearToken();
    return false;
  }
  return window.localStorage.getItem(AUTH_TOKEN_KEY) !== null;
};
