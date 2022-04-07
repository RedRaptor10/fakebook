import { useState } from 'react';

const SignUpForm = ({setShowSignUpForm}) => {
    const [signUpForm, setSignUpForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
    });
    const [signUpErrors, setSignUpErrors] = useState([]);

    const handleSignUpChange = event => {
        setSignUpForm({
            ...signUpForm,
            [event.target.name]: event.target.value
        });
    };

    const submitSignUp = event => {

    };

    return (
        <div id="sign-up-form-container">
            <form id="sign-up-form" action="">
                <button id="close-form-btn" onClick={() => { setShowSignUpForm(false); }}>X</button>
                <div>
                    <h1>Sign Up</h1>
                    <h3>It's quick and easy.</h3>
                </div>
                <div>
                    <input type="text" name="firstName" placeholder="First name" onChange={handleSignUpChange}></input>
                    <input type="text" name="lastName" placeholder="Last name" onChange={handleSignUpChange}></input>
                    <input type="email" name="email" placeholder="Email" onChange={handleSignUpChange}></input>
                    <input type="text" name="username" placeholder="Username" onChange={handleSignUpChange}></input>
                    <input type="password" name="password" placeholder="Password" onChange={handleSignUpChange}></input>
                </div>
                <div>
                    <span>By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy.</span>
                    {signUpErrors.length !== 0 ?
                        <ul id="form-errors">
                            {signUpErrors.map((signUpError, i) => {
                                return(
                                    <li key={i}>{signUpError.msg}</li>
                                )
                            })}
                        </ul>
                    : null}
                    <button type="submit" name="submit" onClick={submitSignUp}>Sign Up</button>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;