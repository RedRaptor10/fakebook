import { useState } from 'react';

const SignUpForm = ({setShowSignUpForm}) => {
    const [signUpForm, setSignUpForm] = useState({
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [signUpErrors, setSignUpErrors] = useState([]);
    const [success, setSuccess] = useState(false);

    const handleSignUpChange = event => {
        setSignUpForm({
            ...signUpForm,
            [event.target.name]: event.target.value
        });
    };

    const submitSignUp = event => {
        event.preventDefault();

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: signUpForm.email,
                username: signUpForm.username,
                password: signUpForm.password,
                firstName: signUpForm.firstName,
                lastName: signUpForm.lastName,
                public: true,
                admin: false
            }),
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/users/create', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setSignUpErrors(res.errors); }
            else {
                // Success. Show success message.
                setSuccess(true);
            }
        });
    };

    return (
        <div className="form-container">
            <div className="overlay" onClick={() => {
                document.body.classList.remove('disable-scroll');
                setShowSignUpForm(false);
            }}></div>
            {success ?
                <div id="sign-up-success">
                    <span>You have successfully signed up. Click <a href="/">here</a> to log in.</span>
                </div>
            :
                <form id="sign-up-form" className="form" action="">
                    <button id="close-form-btn" type="button" onClick={() => {
                        document.body.classList.remove('disable-scroll');
                        setShowSignUpForm(false);
                    }}>X</button>
                    <div>
                        <h1>Sign Up</h1>
                        <h3>It's quick and easy.</h3>
                    </div>
                    {signUpErrors.length !== 0 ?
                            <ul id="form-errors">
                                {signUpErrors.map((signUpError, i) => {
                                    return(
                                        <li key={i}>{signUpError.msg}</li>
                                    )
                                })}
                            </ul>
                        : null}
                    <div>
                        <input type="text" name="firstName" placeholder="First name" onChange={handleSignUpChange}></input>
                        <input type="text" name="lastName" placeholder="Last name" onChange={handleSignUpChange}></input>
                        <input type="email" name="email" placeholder="Email" onChange={handleSignUpChange}></input>
                        <input type="text" name="username" placeholder="Username" onChange={handleSignUpChange}></input>
                        <input type="password" name="password" placeholder="Password" onChange={handleSignUpChange}></input>
                    </div>
                    <div>
                        <span>By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy.</span>
                        <button className="btn btn-green" id="submit-btn" type="submit" name="submit" onClick={submitSignUp}>Sign Up</button>
                    </div>
                </form>
            }
        </div>
    );
};

export default SignUpForm;