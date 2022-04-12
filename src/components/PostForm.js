import { useState, useEffect } from 'react';
import { getCookie } from '../helpers/cookies';

const PostForm = ({user, type, postId, setShowPostForm, refreshToggle, setRefreshToggle }) => {
    const [form, setForm] = useState({
        content: '',
        image: '',
        public: true
    });
    const [formErrors, setFormErrors] = useState();

    // If Post Update, get Post content
    useEffect(() => {
        if (type === 'update') {
            let token = getCookie('odinbook_api_token');

            const options = {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token },
                mode: 'cors'
            };

            fetch(process.env.REACT_APP_SERVER + 'api/posts/' + postId, options)
            .then(function(res) { return res.json(); })
            .then(function(res) {
                setForm({
                    date: res.date,
                    content: res.content,
                    image: res.image,
                    likes: res.likes,
                    comments: res.comments,
                    public: res.public
                });
            });
        }
    }, [type, postId]);

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const submitPost = event => {
        event.preventDefault();

        let route;
        if (type === 'create') { route = 'api/posts/create'; }
        else if (type === 'update') { route = 'api/posts/' + postId + '/update'; }

        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author: user._id,
                date: form.date ? form.date : new Date(),
                content: form.content,
                image: form.image,
                likes: form.likes ? form.likes : [],
                comments: form.comments ? form.comments : [],
                public: form.public
            }),
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + route, options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.errors) { setFormErrors(res.errors); } // Fields required
            else {
                // Success. Toggle refresh state and close form
                refreshToggle ? setRefreshToggle(false) : setRefreshToggle(true);
                setShowPostForm(false);
            }
        });
    };

    return (
        <div id="post-form-container">
            <div className="overlay" onClick={() => { setShowPostForm(false) }}></div>
            <form id="post-form" action="">
                <h1>{type === 'create' ? 'Create Post' : 'Update Post'}</h1>
                <select name="public" value={form.public} onChange={handleChange}>
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                </select>
                <textarea type="textarea" name="content" value={form.content} onChange={handleChange}></textarea>
                <button type="submit" onClick={submitPost}>Post</button>
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

export default PostForm;