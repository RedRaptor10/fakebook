import { useState } from 'react';
import { getCookie } from '../helpers/cookies';

const CommentForm = ({user, post, comment, refreshToggle, setRefreshToggle }) => {
    const [form, setForm] = useState({ content: '' });
    const [formErrors, setFormErrors] = useState();

    const handleChange = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const submitComment = event => {
        if (event.key === 'Enter') {
            let route = 'api/posts/' + post._id + '/comments/create';
            if (comment) { route = 'api/posts/' + post._id + '/' + comment._id + '/update'; }

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
                    likes: form.likes ? form.likes : []
                }),
                mode: 'cors'
            };

            fetch(process.env.REACT_APP_SERVER + route, options)
            .then(function(res) { return res.json(); })
            .then(function(res) {
                if (res.errors) { setFormErrors(res.errors); } // Fields required
                else {
                    // Success. Toggle reset form and refresh state
                    event.target.value = '';
                    setForm({ content: '' });
                    refreshToggle ? setRefreshToggle(false) : setRefreshToggle(true);
                    //setShowCommentForm(false);
                }
            });
        }
    };

    /*const updateComment = comment => {
        setTargetComment(comment);
        setShowCommentForm(true);
    };*/

    return (
        <form id="comment-form" action="">
            <input className="comment-form-input" type="text" name="content" placeholder="Write a comment..." onChange={handleChange} onKeyDown={submitComment} />
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
    )
};

export default CommentForm;