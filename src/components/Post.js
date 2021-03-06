import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { getCookie } from '../helpers/cookies';
import checkImage from '../helpers/checkImage';
import defaultPhoto from '../assets/default-photo.jpg';
import getElapsedTime from '../helpers/getElapsedTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas, faLock, faThumbsUp, faThumbsDown, faMessage, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

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
                <Link to={'/' + post.author.username}>
                    {post.author.photo && checkImage(process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + post.author._id + '/' + post.author.photo) ?
                        <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + post.author._id + '/' + post.author.photo}
                            alt="" />
                    :
                        <img className="profile-photo" src={defaultPhoto} alt="" />}
                </Link>
                <div>
                    <div className="post-author">
                        <Link to={'/' + post.author.username}>{post.author.firstName + ' ' + post.author.lastName}</Link>
                    </div>
                    <div className="post-date-public">
                        <span className="post-date">{getElapsedTime(new Date(post.date))}</span>
                        <span className="post-public">
                            {post.public ?
                                <span>
                                    <FontAwesomeIcon icon={faEarthAmericas} />
                                    Public
                                </span>
                            :
                                <span>
                                    <FontAwesomeIcon icon={faLock} />
                                    Private
                                </span>}
                        </span>
                    </div>
                </div>
            </div>
            <div className="post-content">{post.content}</div>
            {likes.length > 0 ?
                <div className="post-likes"><FontAwesomeIcon icon={faThumbsUp} />{likes.length + (likes.length === 1 ? ' Like' : ' Likes')}</div>
            : null}
            {user._id === post.author._id ?
                <div className="post-btns">
                    <button onClick={() => { document.getElementById('post-' + post._id).querySelector('.comment-form-input').focus() }}>
                        <FontAwesomeIcon icon={faMessage} />Comment
                    </button>
                    <button onClick={() => { updatePost(post) }}><FontAwesomeIcon icon={faPencil} />Edit</button>
                    <button onClick={() => { deletePost(post) }}><FontAwesomeIcon icon={faTrashCan} />Delete</button>
                </div>
            :
                <div className="post-btns">
                    {likes.includes(user._id) ?
                        <button onClick={() => { likePost('unlike') }}><FontAwesomeIcon icon={faThumbsDown} />Unlike</button>
                    :
                        <button onClick={() => { likePost('like') }}><FontAwesomeIcon icon={faThumbsUp} />Like</button>
                    }
                    <button onClick={() => { document.getElementById('post-' + post._id).querySelector('.comment-form-input').focus() }}>
                        <FontAwesomeIcon icon={faMessage} />Comment
                    </button>
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