import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Profile from './Profile';

const App = () => {
  const [user, setUser] = useState();

  // Check authorization on mount
  useEffect(() => {

  }, []);

  return (
    <HashRouter>
      {user ? <Header user={user} setUser={setUser} /> : null}
      <Routes>
        <Route exact path="/" element={<Home user={user} setUser={setUser} />} />
        <Route exact path="/:username" element={
          user ? <Profile user={user} /> : <Home user={user} setUser={setUser} />
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;