import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from '../helpers/cookies';
import PhotoForm from './PhotoForm';
import ProfileForm from './ProfileForm';
import Post from './Post';
import PostForm from './PostForm';
import checkImage from '../helpers/checkImage';
import defaultPhoto from '../assets/default-photo.jpg';

const Profile = ({user, setUser, darkMode}) => {
    const { username } = useParams(); // Get profile username from url
    const [userId, setUserId] = useState();
    const [profile, setProfile] = useState();
    const [friends, setFriends] = useState();
    const [posts, setPosts] = useState();
    const [showPhotoForm, setShowPhotoForm] = useState();
    const [showProfileForm, setShowProfileForm] = useState();
    const [showPostForm, setShowPostForm] = useState(false);
    const [targetPost, setTargetPost] = useState();
    const [refreshToggle, setRefreshToggle] = useState(false);
    const navigate = useNavigate();
    const sampleAccount = {
        email: 'johndoe@johndoe.com'
    };

    // Get Profile
    useEffect(() => {
        let token = getCookie('fakebook_api_token');

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
    }, [user, username]);

    // Get Friends
    useEffect(() => {
        if (profile) {
            let token = getCookie('fakebook_api_token');

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
                setFriends(res.splice(0, 9)); // Display only 9 friends
            });
        }
    }, [profile, username]);

    // Get Posts
    useEffect(() => {
        if (userId) {
            let token = getCookie('fakebook_api_token');

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
        else if (action === 'add') { subroute = '/add-friend' }
        else if (action === 'deleteSent') { subroute = '/delete-request/sent' }
        else if (action === 'deleteReceived') { subroute = '/delete-request/received' }

        let token = getCookie('fakebook_api_token');

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
            document.cookie = 'fakebook_api_token=' + res.token + '; SameSite=Lax; path=/';
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

    const deleteAccount = () => {
        let token = getCookie('fakebook_api_token');

        const options = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/users/' + user.username + '/delete', options)
        .then(function(res) { return res.json(); })
        .then(function() {
            setUser();
            deleteCookie('fakebook_api_token');
            navigate('/');
        });
    };

    return (
        profile ?
            <main id="profile" className={darkMode ? 'dark' : null}>
                <section id="profile-info">
                    <div id="profile-photo">
                        {profile.photo && checkImage(process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + profile._id + '/' + profile.photo) ?
                            <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + profile._id + '/' + profile.photo}
                            alt="" />
                        :
                            <img className="profile-photo" src={defaultPhoto} alt="" />}
                        {user._id === profile._id ?
                            <button id="edit-photo-btn" onClick={() => {
                                document.body.classList.add('disable-scroll');
                                setShowPhotoForm(true);
                            }}>Edit photo</button>
                        : null}
                    </div>
                    <div id="profile-name">
                        <h1>{profile.firstName + ' ' + profile.lastName}</h1>
                        <h3>{profile.friends.length + (profile.friends.length === 1 ? ' Friend' : ' Friends')}</h3>
                    </div>
                    {user._id === profile._id ?
                        <div id="profile-btns">
                            <button className="btn btn-blue" onClick={() => {
                                document.body.classList.add('disable-scroll');
                                setShowProfileForm(true);
                            }}>Edit profile</button>
                            {user.email !== sampleAccount.email ?
                                <button className="btn btn-red" onClick={deleteAccount}>Delete Account</button>
                            : null}
                        </div>
                    :
                        <div id="profile-btns">
                            {profile.friends.includes(user._id) ? <button className="btn btn-red" onClick={() => { handleRequest('delete') }}>Delete Friend</button> :
                                profile.requests.received.includes(user._id) ? <button className="btn btn-red" onClick={() => { handleRequest('deleteSent') }}>Cancel Friend Request</button> :
                                    profile.requests.sent.includes(user._id) ?
                                    <div>
                                        <button className="btn btn-blue" onClick={() => { handleRequest('add') }}>Accept Request</button>
                                        <button className="btn btn-red" onClick={() => { handleRequest('deleteReceived') }}>Delete Request</button>
                                    </div>
                                :
                                    <button className="btn btn-blue" onClick={() => { handleRequest('send') }}>Add Friend</button>}
                        </div>}
                </section>
                <hr />
                <section id="profile-main">
                    <aside id="profile-sidebar">
                        <div id="profile-friends">
                            <h2>Friends</h2>
                            <div id="profile-friends-display">
                                {friends ?
                                    friends.map(friend => {
                                        return (
                                            <Link key={friend._id} to={'/' + friend.username}>
                                                <div className="profile-friend">
                                                    {friend.photo && checkImage(process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + friend._id + '/' + friend.photo) ?
                                                        <img className="profile-friend-photo"
                                                            src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + friend._id + '/' + friend.photo}
                                                            alt="" />
                                                    :
                                                        <img className="profile-friend-photo" src={defaultPhoto} alt="" />}
                                                    <div className="profile-friend-name">
                                                        {friend.firstName + ' ' + friend.lastName}
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                : null}
                            </div>
                        </div>
                    </aside>
                    {profile.public || user._id === profile._id || profile.friends.includes(user._id) || user.admin ?
                        <div id="profile-posts-container">
                            {user._id === profile._id ?
                                <div id="create-post-container">
                                    {user.photo && checkImage(process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + user._id + '/' + user.photo) ?
                                        <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + user._id + '/' + user.photo}
                                        alt="" />
                                    :
                                        <img className="profile-photo" src={defaultPhoto} alt="" />}
                                    <div id="create-post-btn" onClick={createPost}>What's on your mind, {user.firstName}?</div>
                                </div>
                            : null}
                            <h2>Posts</h2>
                            <div id="profile-posts">
                                {posts && posts.length > 0 ?
                                    posts.map(post => {
                                        return (
                                            user._id === profile._id || post.public ?
                                                <Post key={post._id} user={user} post={post} updatePost={updatePost} deletePost={deletePost} />
                                            : null
                                        )
                                    })
                                : <div id="profile-no-posts">This user has no posts.</div>}
                            </div>
                        </div>
                    :
                        <div id="profile-private">This profile is private.</div>}
                </section>
                {showPhotoForm ?
                    <PhotoForm user={user} setUser={setUser} setShowPhotoForm={setShowPhotoForm} />
                : null}
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