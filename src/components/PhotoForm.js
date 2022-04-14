import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';

const PhotoForm = ({user, setUser, setShowPhotoForm }) => {
    const [photo, setPhoto] = useState();
    const [formErrors, setFormErrors] = useState();

    const handleChange = event => {
        setPhoto(event.target.files[0]);
    };

    const submitPhoto = event => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('photo', photo);

        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData,
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/users/' + user.username + '/upload', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setFormErrors(res.errors); }
            else {
                // Success. Set User state and update token
                setUser(res.user);
                document.cookie = 'odinbook_api_token=' + res.token + '; SameSite=Lax; path=/';

                setShowPhotoForm(false);
            }
        });
    };

    return (
        <div id="photo-form-container">
            <div className="overlay" onClick={() => { setShowPhotoForm(false) }}></div>
            <form id="photo-form" action="" encType="multipart/form-data">
                <input type="file" name="photo" onChange={handleChange}></input>
                <button type="submit" onClick={submitPhoto}>Upload</button>
                {formErrors ?
                    <ul id="form-errors">
                        {formErrors.map((formError, i) => {
                            return (
                                <li key={i}>{formError.msg}</li>
                            )
                        })}
                    </ul>
                : null}
            </form>
        </div>
    )
};

export default PhotoForm;