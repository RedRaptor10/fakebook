import React, { useState } from 'react';
import SignUpForm from './SignUpForm';

const Home = ({user}) => {
    const [logInForm, setLogInForm] = useState({
        email: '',
        password: ''
    });
    const [logInErrors, setLogInErrors] = useState([]);
    const [showSignUpForm, setShowSignUpForm] = useState(false);

    const handleLogInChange = event => {
        setLogInForm({
            ...logInForm,
            [event.target.name]: event.target.value
        });
    };

    const submitLogIn = event => {

    };

    return (
        <main id="home">
            {user ?
                <div></div>
            :
                <div>
                    <div>
                        <h1>odinbook</h1>
                        <h3>Connect with friends and the world around you on Odinbook.</h3>
                    </div>
                    <form id="log-in-form" action ="">
                        <input type="text" name="email" placeholder="Email" onChange={handleLogInChange}></input>
                        <input type="password" name="password" placeholder="Password" onChange={handleLogInChange}></input>
                        <button type="submit" name="submit" onClick={submitLogIn}>Log In</button>
                        {logInErrors.length !== 0 ?
                            <ul id="form-errors">
                                {logInErrors.map((logInError, i) => {
                                    return(
                                        <li key={i}>{logInError.msg}</li>
                                    )
                                })}
                            </ul>
                        : null}
                        <button type="button" name="create" onClick={() => { setShowSignUpForm(true); }}>Create new account</button>
                    </form>

                    {showSignUpForm ?
                        <SignUpForm user={user} setShowSignUpForm={setShowSignUpForm} />
                    : null}

                </div>
            }
        </main>
    );
};

export default Home;