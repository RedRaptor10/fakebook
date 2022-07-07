import { useState, useEffect } from 'react';
import Post from './Post';
import PostForm from './PostForm';
import { getCookie } from '../helpers/cookies';

const Timeline = ({user}) => {
    const [posts, setPosts] = useState();
    const [showPostForm, setShowPostForm] = useState(false);
    const [targetPost, setTargetPost] = useState();
    const [refreshToggle, setRefreshToggle] = useState(false);

    // Get Posts
    useEffect(() => {
        let token = getCookie('fakebook_api_token');

        const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/posts/timeline/' + user._id + '?sort=date&order=desc', options)
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            setPosts(res);
        });
    }, [user._id, refreshToggle]);

    const createPost = () => {
        document.body.classList.add('disable-scroll');
        setTargetPost();
        setShowPostForm(true);
    };

    const updatePost = post => {
        document.body.classList.add('disable-scroll');
        setTargetPost(post);
        setShowPostForm(true);
    };

    const deletePost = post => {
        let token = getCookie('fakebook_api_token');

        const options = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/posts/' + post._id + '/delete', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            refreshToggle ? setRefreshToggle(false) : setRefreshToggle(true);
        });
    };

    return (
        <div id="timeline">
            <div id="create-post-container">
                {user.photo ?
                    <img className="profile-photo" src={process.env.REACT_APP_SERVER + "/uploads/profile-photos/" + user._id + "/" + user.photo}
                    alt={user.firstName + ' ' + user.lastName} />
                :
                    <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/default.jpg'}
                        alt={user.firstName + ' ' + user.lastName} />}
                <div id="create-post-btn" onClick={createPost}>What's on your mind, {user.firstName}?</div>
            </div>
            <div id="profile-posts">
                {posts ?
                    posts.map(post => {
                        return (
                            post.public ?
                                <Post key={post._id} user={user} post={post} updatePost={updatePost} deletePost={deletePost} />
                            : null
                        )
                    })
                : null}
            </div>
            {showPostForm ?
                <PostForm user={user} post={targetPost} setShowPostForm={setShowPostForm}
                    refreshToggle={refreshToggle} setRefreshToggle={setRefreshToggle} />
            : null}
        </div>
    );
};

export default Timeline;