import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { MetadataContext, useMetadata } from "../utils/Metadata";

import "./App.css";
import { Header, Navbar } from "./global";
import { User } from "../api";
import { fetchCurrentUser, UserContext } from "../utils/User";

const App = () => {
  const metadata = useMetadata();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    fetchCurrentUser(setUser);
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
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
