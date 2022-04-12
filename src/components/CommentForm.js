import { useState } from 'react';
import { getCookie } from '../helpers/cookies';

const CommentForm = ({user, type, postId, commentId, refreshToggle, setRefreshToggle }) => {
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
            let route;
            if (type === 'create') { route = 'api/posts/' + postId + '/comments/create'; }
            else if (type === 'update') { route = 'api/posts/' + postId + '/' + commentId + '/update'; }

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
                    //comments: form.comments ? form.comments : []
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
                    setForm({ content: '' });
                    //setShowCommentForm(false);
                }
            });
        }
    };

    /*const updateComment = commentId => {
        setPostType('update');
        setTargetPost(postId);
        setShowPostForm(true);
    };*/

    return (
        <input className="comment-input" type="text" name="content" placeholder="Write a comment..." onChange={handleChange} onKeyDown={submitComment} />
    )
};

export default CommentForm;