import { createContext } from "react";
import { User, AuthData } from "../rust_api";
import { clearToken, setToken } from "./Auth";

export interface UserContextType {
  isLoading: boolean;
  user?: User;
  setUser: (user?: User) => void;
}

/** Information about the currently authenticated user. */
export const UserContext = createContext<UserContextType>({
  isLoading: false,
  setUser: () => {},
});

/** Fetch information from the API about the currently authenticated user and update user context
 * using the given callback.
 */
export const fetchCurrentUser = (setUser: (user?: User) => void) => {
  User.fetch_data()
    .then((user) => {
      setUser(user ? user : undefined);
    })
    .catch(() => {
      setUser();
    });
};

/** Store API token in local storage and update user context by fetching API. */
export const loginUser = (setUser: (user?: User) => void, auth: AuthData) => {
  setToken(auth.sessionToken, auth.expiry);
  fetchCurrentUser(setUser);
};

/** Notify API of logout then clear stored API token and user context. */
export const logoutUser = (setUser: (user?: User) => void) => {
  const clearUserData = () => {
    setUser();
    clearToken();
  };

  User.logout().then(clearUserData, clearUserData);
};
