import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import LogInForm from './LogInForm';
import Home from './Home';
import Profile from './Profile';
import { getCookie, deleteCookie } from '../helpers/cookies';

const App = () => {
  const [user, setUser] = useState();
  const [loaded, setLoaded] = useState(false); // Page loaded, required so that app renders a blank page before authorization

  // Check authorization on mount
  useEffect(() => {
    let token = getCookie('odinbook_api_token');
		// If no token then unset user, delete cookie, and exit
		if (token === '') {
			setUser();
      deleteCookie('odinbook_api_token');
      setLoaded(true);
			return;
		}

		const options = {
			method: 'GET',
			headers: { 'Authorization': 'Bearer ' + token },
			mode: 'cors'
		};

		fetch(process.env.REACT_APP_SERVER + 'api/auth', options)
		.then(function(res) {
			// If unauthorized then unset user, delete cookie, and throw error
			if (res.statusText === 'Unauthorized') {
				setUser();
				deleteCookie('odinbook_api_token');
				throw new Error(res.statusText);
			} else {
				return res.json();
			}
		})
		.then(function(res) {
      setUser(res);
      setLoaded(true);
    })
    .catch(err => { console.log(err.message); });
  }, []);

  return (
      loaded ?
        <HashRouter>
          {user ? <Header user={user} setUser={setUser} /> : null}
          <Routes>
            <Route exact path="/" element={
              user ? <Home user={user} setUser={setUser} /> : <LogInForm setUser={setUser} />} />
            <Route exact path="/:username" element={
              user ? <Profile user={user} /> : <LogInForm setUser={setUser} />
            } />
          </Routes>
        </HashRouter>
      : null
  );
};

export default App;