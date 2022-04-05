import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';

const App = () => {
  const [user, setUser] = useState();

  // Check authorization on mount
  useEffect(() => {

  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<Home user={user} setUser={setUser} />} />
      </Routes>
    </HashRouter>
  );
};

export default App;