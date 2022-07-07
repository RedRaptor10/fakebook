import { useState, useEffect } from 'react';
import { getCookie } from '../helpers/cookies';

const PostForm = ({user, post, setShowPostForm, refreshToggle, setRefreshToggle }) => {
    const [form, setForm] = useState({
        content: '',
        image: '',
        public: true
    });
    const [formErrors, setFormErrors] = useState();

    // If Post Update, get Post content
    useEffect(() => {
        if (post) {
            let token = getCookie('fakebook_api_token');

            const options = {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token },
                mode: 'cors'
            };

            fetch(process.env.REACT_APP_SERVER + 'api/posts/' + post._id, options)
            .then(function(res) { return res.json(); })
            .then(function(res) {
                setForm({
                    date: res.date,
                    content: res.content,
                    image: res.image,
                    likes: res.likes,
                    public: res.public
                });
            });
        }
    }, [post]);

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const submitPost = event => {
        event.preventDefault();

        let route = 'api/posts/create';
        if (post) { route = 'api/posts/' + post._id + '/update'; }

        let token = getCookie('fakebook_api_token');

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
                document.body.classList.remove('disable-scroll');
                setShowPostForm(false);
            }
        });
    };

    return (
        <div className="form-container">
            <div className="overlay" onClick={() => {
                document.body.classList.remove('disable-scroll');
                setShowPostForm(false) }}>
            </div>
            <form id="post-form" className="form" action="">
                <button id="close-form-btn" type="button" onClick={() => {
                    document.body.classList.remove('disable-scroll');
                    setShowPostForm(false);
                }}>X</button>
                <h1>{!post ? 'Create Post' : 'Update Post'}</h1>
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
                <textarea type="textarea" name="content" placeholder={'What\'s on your mind, ' + user.firstName + '?'}
                    value={form.content} onChange={handleChange}></textarea>
                <button className="btn btn-blue" id="submit-btn" type="submit" onClick={submitPost}>{post ? 'Update' : 'Post'}</button>
            </form>
        </div>
    );
};

export default PostForm;