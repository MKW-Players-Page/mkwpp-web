import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { MetadataContext, useMetadata } from "../utils/Metadata";

import "./App.css";
import { Header, Navbar } from "./global";
import { User } from "../api";
import { fetchCurrentUser, UserContext } from "../utils/User";


interface AppUserState {
  isLoading: boolean;
  user?: User;
};


const App = () => {
  const metadata = useMetadata();

  const initialUserState = { isLoading: true };
  const [user, setUserState] = useState<AppUserState>(initialUserState);

  const setUser = (user?: User) => {
    setUserState({ isLoading: false, user });
  };

  useEffect(() => {
    fetchCurrentUser(setUser);
  }, []);

  return (
    <>
      <UserContext.Provider value={{ isLoading: user.isLoading, user: user.user, setUser }}>
        <Header />
        <Navbar />
        <div className="content">
          <MetadataContext.Provider value={metadata}>
            <Outlet />
          </MetadataContext.Provider>
        </div>
      </UserContext.Provider>
    </>
  );
};

export default App;
