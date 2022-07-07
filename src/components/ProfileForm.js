import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';

const ProfileForm = ({user, setUser, profile, setShowProfileForm }) => {
    const [form, setForm] = useState({
        email: profile.email,
        username: profile.username,
        password: '',
        confirmPassword: '',
        firstName: profile.firstName,
        lastName: profile.lastName,
        public: profile.public
    });
    const [formErrors, setFormErrors] = useState();
    const navigate = useNavigate();

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const submitProfile = event => {
        event.preventDefault();

        let token = getCookie('fakebook_api_token');

        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: form.email,
                username: form.username,
                password: form.password,
                confirmPassword: form.confirmPassword,
                firstName: form.firstName,
                lastName: form.lastName,
                friends: profile.friends,
                public: form.public,
                admin: profile.admin
            }),
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/users/' + user.username + '/update', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setFormErrors(res.errors); } // Fields required
            else {
                // Success. Set User state and update token
                setUser(res.user);
                document.cookie = 'fakebook_api_token=' + res.token + '; SameSite=Lax; path=/';

                // Navigate to Home page
                navigate('/');
            }
        });
    };

    return (
        <div className="form-container">
            <div className="overlay" onClick={() => {
                document.body.classList.remove('disable-scroll');
                setShowProfileForm(false)
            }}></div>
            <form id="profile-form" className="form" action="">
                <h1>Edit Profile</h1>
                {formErrors ?
                    <ul id="form-errors">
                        {formErrors.map((formError, i) => {
                            return (
                                <li key={i}>{formError.msg}</li>
                            )
                        })}
                    </ul>
                : null}
                <select name="public" value={form.public} onChange={handleChange}>
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                </select>
                <label htmlFor="email">Email</label>
                <input type="text" name="email" value={form.email} onChange={handleChange}></input>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={form.username} onChange={handleChange}></input>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange}></input>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}></input>
                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange}></input>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange}></input>
                <button id="submit-btn" className="btn btn-blue" type="submit" onClick={submitProfile}>Update</button>
            </form>
        </div>
    );
};

export default ProfileForm;