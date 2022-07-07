import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { getCookie } from '../helpers/cookies';
import getElapsedTime from '../helpers/getElapsedTime';

const Post = ({user, post, updatePost, deletePost}) => {
    const [likes, setLikes] = useState(post.likes);
    const [comments, setComments] = useState();
    const [targetComment, setTargetComment] = useState();
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [refreshToggle, setRefreshToggle] = useState(false);

    // Get Post Comments
    useEffect(() => {
        let token = getCookie('fakebook_api_token');

        const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/posts/' + post._id + '/comments', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            setComments(res);
        });
    }, [post, refreshToggle]);

    const likePost = type => {
        let token = getCookie('fakebook_api_token');

        const options = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/posts/' + post._id + '/' + type, options)
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
        <div id={'post-' + post._id} className="post">
            <div className="post-meta">
                {post.author.photo ?
                    <img className="profile-photo" src={process.env.REACT_APP_SERVER + "/uploads/profile-photos/" + post.author._id + "/" + post.author.photo}
                        alt={post.author.firstName + ' ' + post.author.lastName} />
                :
                    <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/default.jpg'}
                        alt={post.author.firstName + ' ' + post.author.lastName} />}
                <div>
                    <div className="post-author">
                        <Link to={'/' + post.author.username}>{post.author.firstName + ' ' + post.author.lastName}</Link>
                    </div>
                    <div className="post-date-public">
                        <span className="post-date">{getElapsedTime(new Date(post.date))}</span>
                        <span className="post-public">{post.public ? 'Public' : 'Private'}</span>
                    </div>
                </div>
            </div>
            <div className="post-content">{post.content}</div>
            {likes.length > 0 ?
                <div className="post-likes">{likes.length + (likes.length === 1 ? ' Like' : ' Likes')}</div>
            : null}
            {user._id === post.author._id ?
                <div className="post-btns">
                    <button onClick={() => { document.getElementById('post-' + post._id).querySelector('.comment-form-input').focus() }}>Comment</button>
                    <button onClick={() => { updatePost(post) }}>Edit</button>
                    <button onClick={() => { deletePost(post) }}>Delete</button>
                </div>
            :
                <div className="post-btns">
                    {likes.includes(user._id) ?
                        <button onClick={() => { likePost('unlike') }}>Unlike</button>
                    :
                        <button onClick={() => { likePost('like') }}>Like</button>
                    }
                    <button onClick={() => { document.getElementById('post-' + post._id).querySelector('.comment-form-input').focus() }}>Comment</button>
                </div>}
            <CommentForm user={user} post={post} refreshToggle={refreshToggle} setRefreshToggle={setRefreshToggle} />
            {comments ?
                <div className="comments">
                    {comments.map(comment => {
                        return (
                            <Comment key={comment._id} user={user} post={post} comment={comment} targetComment={targetComment} setTargetComment={setTargetComment}
                                showCommentForm={showCommentForm} setShowCommentForm={setShowCommentForm}
                                refreshToggle={refreshToggle} setRefreshToggle={setRefreshToggle} />
                        )
                    })}
                </div>
            : null}
        </div>
    );
};

export default Post;