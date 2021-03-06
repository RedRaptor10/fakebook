import { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import { getCookie } from '../helpers/cookies';
import checkImage from '../helpers/checkImage';
import defaultPhoto from '../assets/default-photo.jpg';
import getElapsedTime from '../helpers/getElapsedTime';

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
        let token = getCookie('fakebook_api_token');

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
        let token = getCookie('fakebook_api_token');

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
        <div className="comment-container">
            {comment.author && user._id === comment.author._id && targetComment === comment && showCommentForm ?
                <div>
                    <CommentForm user={user} post={post} comment={comment}
                        refreshToggle={refreshToggle} setRefreshToggle={setRefreshToggle} />
                    <div className="comment-btns">
                        <button className="comment-cancel-btn" onClick={cancelUpdate}>Cancel</button>
                    </div>
                </div>
            :
                <div className="comment">
                    <div className="comment-left">
                        <Link to={'/' + comment.author.username}>
                            {comment.author.photo && checkImage(process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + comment.author._id + '/' +
                                comment.author.photo) ?
                                <img className="profile-photo"
                                    src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + comment.author._id + '/' + comment.author.photo}
                                    alt="" />
                            :
                                <img className="profile-photo" src={defaultPhoto} alt="" />}
                        </Link>
                    </div>
                    <div className="comment-right">
                        <div className="comment-box">
                            <div className="comment-author">
                                <Link to={'/' + comment.author.username}>{comment.author.firstName + ' ' + comment.author.lastName}</Link>
                            </div>
                            <div className="comment-content">{comment.content}</div>
                        </div>
                        {likes.length > 0 ?
                            <div className="comment-likes">{likes.length + (likes.length === 1 ? ' Like' : ' Likes')}</div>
                        : null}
                        <div className="comment-footer">
                            {comment.author && user._id === comment.author._id ?
                                <div className="comment-btns">
                                    <button onClick={updateComment}>Edit</button>
                                    <button onClick={deleteComment}>Delete</button>
                                </div>
                            :
                                <div className="comment-btns">
                                    {likes.includes(user._id) ?
                                        <button onClick={() => { likeComment('unlike') }}>Unlike</button>
                                    :
                                        <button onClick={() => { likeComment('like') }}>Like</button>}
                                </div>}
                            <div className="comment-date">{getElapsedTime(new Date(comment.date))}</div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
};

export default Comment;