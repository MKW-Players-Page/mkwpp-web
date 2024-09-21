import { createContext } from 'react';

import { Auth, coreApi, User } from '../api';
import { clearToken, setToken } from './Auth';


export interface UserContextType {
  user?: User;
  setUser: (user?: User) => void;
};

/** Information about the currently authenticated user. */
export const UserContext = createContext<UserContextType>({
  setUser: () => {},
});

/** Fetch information from the API about the currently authenticated user and update user context
 * using the given callback.
 */
export const fetchCurrentUser = (setUser: (user?: User) => void) => {
  coreApi.currentUser().then((user) => {
    setUser(user);
  }).catch(() => {
    setUser();
  });
};

/** Store API token in local storage and update user context by fetching API. */
export const loginUser = (setUser: (user?: User) => void, auth: Auth) => {
  setToken(auth.token, auth.expiry);
  fetchCurrentUser(setUser);
};

/** Notify API of logout then clear stored API token and user context. */
export const logoutUser = (setUser: (user?: User) => void) => {
  const clearUserData = () => {
    setUser();
    clearToken();
  };

  coreApi.logout().then(clearUserData).catch(clearUserData);
};
