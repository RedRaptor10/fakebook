import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import { getCookie } from '../helpers/cookies';

const Comment = ({user, post, comment, targetComment, setTargetComment, showCommentForm, setShowCommentForm, refreshToggle, setRefreshToggle}) => {
    const [likes, setLikes] = useState(comment.likes);

    const updateComment = () => {
        setTargetComment(comment);
        setShowCommentForm(true);
    };

    const cancelUpdate = () => {
        setTargetComment();
        setShowCommentForm(false);
    };

    const deleteComment = () => {
        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/comments/' + comment._id + '/delete', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            refreshToggle ? setRefreshToggle(false) : setRefreshToggle(true);
        });
    };

    const likeComment = type => {
        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/posts/' + post._id + '/comments/' + comment._id + '/' + type, options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            // Update Likes state
            if (type === 'like') {
                const temp = likes.slice();
                temp.push(user._id);
                setLikes(temp);
            } else if (type === 'unlike') {
                const temp = likes.slice();
                temp.splice(temp.indexOf(user._id), 1);
                setLikes(temp);
            }
        });
    };

    return (
        <div>
            {comment.author && user._id === comment.author._id && targetComment === comment && showCommentForm ?
                <div>
                    <CommentForm user={user} post={post} comment={comment}
                        refreshToggle={refreshToggle} setRefreshToggle={setRefreshToggle} />
                    <button onClick={cancelUpdate}>Cancel</button>
                </div>
            :
                <div>
                    {comment.content}
                    {likes.length > 0 ? likes.length +
                        (likes.length === 1 ? ' Like' : ' Likes') : null}
                    {comment.author && user._id === comment.author._id ?
                        <div>
                            <button onClick={updateComment}>Edit</button>
                            <button onClick={deleteComment}>Delete</button>
                        </div>
                    :
                        <div>
                            {likes.includes(user._id) ?
                                <button onClick={() => { likeComment('unlike') }}>Unlike</button>
                            :
                                <button onClick={() => { likeComment('like') }}>Like</button>}
                        </div>}
                </div>
            }
        </div>
    )
};

export default Comment;