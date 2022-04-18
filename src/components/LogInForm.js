import { useState } from 'react';
import SignUpForm from './SignUpForm';

const LogInForm = ({setUser}) => {
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
        event.preventDefault();

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: logInForm.email,
                password: logInForm.password
            }),
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/log-in', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setLogInErrors(res.errors); } // Email/password required
            else if (!res.user) { setLogInErrors([{ msg: res.info.message }]); } // Incorrect email/password
            else {
                // Success. Set token as a cookie and set user
                document.cookie = 'odinbook_api_token=' + res.token + '; SameSite=Lax; path=/';
                setUser(res.user);
            }
        });
    };

    return (
        <main id="log-in-page">
            <div id="log-in-form-container">
                <div id="log-in-form-left">
                    <h1>odinbook</h1>
                    <h2>Connect with friends and the world around you on Odinbook.</h2>
                </div>
                <div id="log-in-form-right">
                    <form id="log-in-form" action ="">
                        {logInErrors.length !== 0 ?
                            <ul id="form-errors">
                                {logInErrors.map((logInError, i) => {
                                    return(
                                        <li key={i}>{logInError.msg}</li>
                                    )
                                })}
                            </ul>
                        : null}
                        <input type="text" name="email" placeholder="Email" onChange={handleLogInChange}></input>
                        <input type="password" name="password" placeholder="Password" onChange={handleLogInChange}></input>
                        <button className="btn btn-blue" type="submit" name="submit" onClick={submitLogIn}>Log In</button>
                        <button className="btn btn-green" type="button" name="create" onClick={() => {
                            document.body.classList.add('disable-scroll');
                            setShowSignUpForm(true);
                        }}>Create new account</button>
                    </form>
                </div>
            </div>

            {showSignUpForm ?
                <SignUpForm setShowSignUpForm={setShowSignUpForm} />
            : null}
        </main>
    );
};

export default LogInForm;