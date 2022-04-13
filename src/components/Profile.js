import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';
import ProfileForm from './ProfileForm';
import Post from './Post';
import PostForm from './PostForm';

const Profile = ({user, setUser}) => {
    const { username } = useParams(); // Get profile username from url
    const [userId, setUserId] = useState();
    const [profile, setProfile] = useState();
    const [showProfileForm, setShowProfileForm] = useState();
    const [friends, setFriends] = useState();
    const [posts, setPosts] = useState();
    const [showPostForm, setShowPostForm] = useState(false);
    const [targetPost, setTargetPost] = useState();
    const [refreshToggle, setRefreshToggle] = useState(false);

    // Get Profile
    useEffect(() => {
        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/users/' + username, options)
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            if (!res) { throw new Error('User not found'); }
            setUserId(res._id);
            setProfile(res);
        })
        .catch(err => { console.log(err); });
    }, [username]);

    // Get Friends
    useEffect(() => {
        if (profile) {
            let token = getCookie('odinbook_api_token');

            const options = {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token },
                mode: 'cors'
            };

            fetch(process.env.REACT_APP_SERVER + 'api/users/' + username + '/get-friends', options)
            .then(function(res) {
                return res.json();
            })
            .then(function(res) {
                setFriends(res);
            });
        }
    }, [profile, username]);

    // Get Posts
    useEffect(() => {
        if (userId) {
            let token = getCookie('odinbook_api_token');

            const options = {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + token },
                mode: 'cors'
            };

            fetch(process.env.REACT_APP_SERVER + 'api/posts/users/' + userId + '?sort=date&order=desc', options)
            .then(function(res) {
                return res.json();
            })
            .then(function(res) {
                setPosts(res);
            });
        }
    }, [userId, refreshToggle]);

    const handleRequest = action => {
        let subroute;
        if (action === 'delete') { subroute = '/delete-friend' }
        else if (action === 'send') { subroute = '/send-request' }
        else if (action === 'deleteSent') { subroute = '/delete-request/sent' }

        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/users/' + username + subroute, options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            // Set User and Profile states and update token
            setUser(res.user);
            setProfile(res.target);
            document.cookie = 'odinbook_api_token=' + res.token + '; SameSite=Lax; path=/';
        });
    };

    const createPost = () => {
        setTargetPost();
        setShowPostForm(true);
    };

    const updatePost = post => {
        setTargetPost(post);
        setShowPostForm(true);
    };

    const deletePost = post => {
        let token = getCookie('odinbook_api_token');

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
        profile ?
            <main id="profile">
                <section id="profile-header">
                    <div id="cover"></div>
                </section>
                <section id="profile-info">
                    <div id="profile-pic"></div>
                    <h1>{profile.firstName + ' ' + profile.lastName}</h1>
                    <h3>{profile.friends.length + (profile.friends.length === 1 ? ' Friend' : ' Friends')}</h3>
                    {user._id === profile._id ?
                        <button onClick={() => { setShowProfileForm(true) }}>Edit profile</button>
                    :
                        profile.friends.includes(user._id) ? <button onClick={() => { handleRequest('delete') }}>Delete Friend</button> :
                            profile.requests.received.includes(user._id) ? <button onClick={() => { handleRequest('deleteSent') }}>Cancel Friend Request</button> :
                                <button onClick={() => { handleRequest('send') }}>Add Friend</button>}
                </section>
                <nav id="profile-nav">
                    <ul>
                        <li>Posts</li>
                        <li>About</li>
                        <li>Friends</li>
                    </ul>
                </nav>
                <section id="profile-main">
                    <aside id="profile-sidebar">
                        <div id="profile-intro">
                            <h3>Intro</h3>
                            {profile.bio ? profile.bio :
                                user._id === profile._id ? <button>Add Bio</button> : null}
                        </div>
                        <div id="profile-main-friends">
                            <h3>Friends</h3>
                            {friends ?
                                friends.map(friend => {
                                    return (
                                        <Link key={friend._id} to={'/' + friend.username}>
                                            {friend.firstName + ' ' + friend.lastName}
                                        </Link>
                                    )
                                })
                            : null}
                        </div>
                    </aside>
                    <div id="profile-posts-container">
                        {user._id === profile._id ? <div onClick={createPost}>Create Post</div> : null}
                        <h3>Posts</h3>
                        <div id="profile-posts">
                            {posts ?
                                posts.map(post => {
                                    return (
                                        user._id === profile._id || post.public ?
                                            <Post key={post._id} user={user} post={post} updatePost={updatePost} deletePost={deletePost} />
                                        : null
                                    )
                                })
                            : null}
                        </div>
                    </div>
                </section>
                {showProfileForm ?
                    <ProfileForm user={user} setUser={setUser} profile={profile} setShowProfileForm={setShowProfileForm} />
                : null}
                {showPostForm ?
                    <PostForm user={user} post={targetPost} setShowPostForm={setShowPostForm}
                        refreshToggle={refreshToggle} setRefreshToggle={setRefreshToggle} />
                : null}
            </main>
        : null
    );
};

export default Profile;