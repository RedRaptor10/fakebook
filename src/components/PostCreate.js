import { useState } from 'react';
import { getCookie } from '../helpers/cookies';

const PostCreate = ({user, setCreatePost, postedToggle, setPostedToggle }) => {
    const [form, setForm] = useState({
        content: '',
        public: true
    });
    const [formErrors, setFormErrors] = useState();

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const createPost = event => {
        event.preventDefault();

        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author: user._id,
                date: new Date(),
                content: form.content,
                public: form.public
            }),
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/posts/create', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setFormErrors(res.errors); } // Fields required
            else {
                // Success. Toggle posted state and close form
                postedToggle ? setPostedToggle(false) : setPostedToggle(true);
                setCreatePost(false);
            }
        });
    };

    return (
        <div id="create-post">
            <div className="overlay" onClick={() => { setCreatePost(false) }}></div>
            <form id="create-post-form" action="">
                <h1>Create Post</h1>
                <select name="public" onChange={handleChange}>
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                </select>
                <textarea type="textarea" name="content" onChange={handleChange}></textarea>
                <button type="submit" onClick={createPost}>Post</button>
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
    );
};

export default PostCreate;