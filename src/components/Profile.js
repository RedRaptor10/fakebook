import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';

const Profile = ({user, setUser}) => {
    const { username } = useParams(); // Get profile username from url
    const [profile, setProfile] = useState();
    const [posts, setPosts] = useState([]);

    // Get Profile on mount & update
    useEffect(() => {
        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/users/' + username, options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            setProfile(res);

            // Get Posts
            fetch(process.env.REACT_APP_SERVER + 'api/posts/users/' + res._id, options)
            .then(function(res) { return res.json(); })
            .then(function(res) { setPosts(res); });
        });
    }, [username]);

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
            setProfile(res.targetUser);
            document.cookie = 'odinbook_api_token=' + res.token + '; SameSite=Lax; path=/';
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
                    <h3>{profile.friends.length + ' Friends'}</h3>
                    {user._id === profile._id ?
                        <button>Edit profile</button>
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
                            {profile.bio ? profile.bio : <button>Add Bio</button>}
                        </div>
                        <div id="profile-main-friends">
                            <h3>Friends</h3>
                            {profile.friends.length > 0 ?
                                profile.friends.map(friend => {
                                    return (
                                        <div key={friend._id}>
                                            {friend.firstName + ' ' + friend.lastName}
                                        </div>
                                    )
                                })
                            : null}
                        </div>
                    </aside>
                    <div id="profile-posts-container">
                        <h3>Posts</h3>
                        <div id="profile-posts">
                            {posts ?
                                posts.map(post => {
                                    return (
                                        <div key={post._id} className="post">
                                            {post.content}
                                        </div>
                                    )
                                })
                            : null}
                        </div>
                    </div>
                </section>
            </main>
        : null
    );
};

export default Profile;