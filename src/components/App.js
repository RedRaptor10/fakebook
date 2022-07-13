import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LogInForm from './LogInForm';
import Home from './Home';
import Profile from './Profile';
import Search from './Search';
import Users from './Users';
import Requests from './Requests';
import { getCookie, deleteCookie } from '../helpers/cookies';

const App = () => {
  const [user, setUser] = useState();
  const [loaded, setLoaded] = useState(false); // Page loaded, required so that app renders a blank page before authorization
  const [darkMode, setDarkMode] = useState(false);

  // Check authorization on mount
  useEffect(() => {
    let token = getCookie('fakebook_api_token');
		// If no token then unset user, delete cookie, and exit
		if (token === '') {
			setUser();
      deleteCookie('fakebook_api_token');
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
				deleteCookie('fakebook_api_token');
				throw new Error(res.statusText);
			} else {
				return res.json();
			}
		})
		.then(function(res) {
      setUser(res);
      setLoaded(true);
    })
    .catch(err => {
      console.log(err.message);
      setLoaded(true);
    });
  }, []);

  return (
      loaded ?
        <HashRouter>
          {user ? <Header user={user} setUser={setUser} darkMode={darkMode} setDarkMode={setDarkMode} /> : null}
          <Routes>
            <Route exact path="/" element={
              user ? <Home user={user} darkMode={darkMode} /> : <LogInForm setUser={setUser} />} />
            <Route exact path="/:username" element={
              user ? <Profile user={user} setUser={setUser} darkMode={darkMode} /> : <LogInForm setUser={setUser} />
            } />
            <Route exact path="/search/:category" element={
              user ? <Search user={user} setUser={setUser} darkMode={darkMode} /> : <LogInForm setUser={setUser} />
            } />
            <Route exact path="/users" element={
              user ? <Users user={user} setUser={setUser} darkMode={darkMode} /> : <LogInForm setUser={setUser} />
            } />
            <Route exact path="/friends/requests" element={
              user ? <Requests user={user} setUser={setUser} darkMode={darkMode} /> : <LogInForm setUser={setUser} />
            } />
          </Routes>
          {!user ? <Footer /> : null}
        </HashRouter>
      : null
  );
};

export default App;