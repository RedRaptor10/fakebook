import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { getCookie } from '../helpers/cookies';

const Post = ({user, post, updatePost, deletePost}) => {
    const [liked, setLiked] = useState();
    const [comments, setComments] = useState();
    const [targetComment, setTargetComment] = useState();
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [refreshToggle, setRefreshToggle] = useState(false);

    // If Post likes array contains User id, set Liked state
    useEffect(() => {
        post.likes.includes(user._id) ? setLiked(true) : setLiked(false);
    }, []);

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
            liked === true ? setLiked(false) : setLiked(true);
        });
    };

    return (
        <div className="post">
            <div className="post-meta">
                {post.author.pic ? <div className="post-pic" /> : <div className="post-pic" />}
                <div className="post-meta-info">
                    <div className="post-author">
                        <Link to={'/' + post.author.username}>{post.author.firstName + ' ' + post.author.lastName}</Link>
                    </div>
                    <div>
                        <div className="post-date">{post.date}</div>
                        <div className="post-public">{post.public ? 'Public' : 'Private'}</div>
                    </div>
                </div>
            </div>
            {post.content}
            {post.author && user._id === post.author._id ?
                <div>
                    <button onClick={() => { updatePost(post) }}>Update</button>
                    <button onClick={() => { deletePost(post) }}>Delete</button>
                </div>
            :
                <div>
                    {liked === true ?
                        <button onClick={() => { likePost('unlike') }}>Unlike</button>
                    :
                        <button onClick={() => { likePost('like') }}>Like</button>
                    }
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