import { Outlet } from 'react-router-dom';

import { MetadataContext, useMetadata } from '../utils/Metadata';

import { Header, Navbar } from './global';
import './App.css';

const App = () => {
  const metadata = useMetadata();

  return (
    <>
      <Header />
      <Navbar />
      <div className="content">
        <MetadataContext.Provider value={metadata}>
          <Outlet />
        </MetadataContext.Provider>
      </div>
    </>
  );
};

export default App;
