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
        let token = getCookie('odinbook_api_token');

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
        let token = getCookie('odinbook_api_token');

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
        <div className="post">
            <div className="post-meta">
                {post.author.photo ? <div className="post-photo" /> : <div className="post-photo" />}
                <div className="post-meta-info">
                    <div className="post-author">
                        <Link to={'/' + post.author.username}>{post.author.firstName + ' ' + post.author.lastName}</Link>
                    </div>
                    <div>
                        <div className="post-date">{getElapsedTime(new Date(post.date))}</div>
                        <div className="post-public">{post.public ? 'Public' : 'Private'}</div>
                    </div>
                </div>
            </div>
            {post.content}
            {likes.length > 0 ? likes.length +
                (likes.length === 1 ? ' Like' : ' Likes') : null}
            {user._id === post.author._id ?
                <div>
                    <button onClick={() => { updatePost(post) }}>Update</button>
                    <button onClick={() => { deletePost(post) }}>Delete</button>
                    <button onClick={() => { document.getElementById('comment-form-input').focus() }}>Comment</button>
                </div>
            :
                <div>
                    {likes.includes(user._id) ?
                        <button onClick={() => { likePost('unlike') }}>Unlike</button>
                    :
                        <button onClick={() => { likePost('like') }}>Like</button>
                    }
                    <button onClick={() => { document.getElementById('comment-form-input').focus() }}>Comment</button>
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