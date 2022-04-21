import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';

const Users = ({user, setUser}) => {
    const [users, setUsers] = useState();

    // Get Users
    useEffect(() => {
        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/users', options)
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            setUsers(res);
        });
    }, [user]);

    const handleRequest = (action, username) => {
        let subroute;
        if (action === 'delete') { subroute = '/delete-friend' }
        else if (action === 'send') { subroute = '/send-request' }
        else if (action === 'add') { subroute = '/add-friend' }
        else if (action === 'deleteSent') { subroute = '/delete-request/sent' }
        else if (action === 'deleteReceived') { subroute = '/delete-request/received' }

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
            document.cookie = 'odinbook_api_token=' + res.token + '; SameSite=Lax; path=/';
        });
    };

    return (
        <main id="users">
            <h1>Find Friends</h1>
            {users ?
                <div id="users-list">
                    {users.map(u => {
                        return (
                            u._id !== user._id ?
                                <div key={u._id} className="users-list-user">
                                    <div className="users-list-info">
                                        {u.photo ?
                                            <img className="profile-photo" src={process.env.REACT_APP_SERVER + "/uploads/profile-photos/" + u._id + "/" + u.photo}
                                                alt={u.firstName + ' ' + u.lastName} />
                                        :
                                            <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/default.jpg'}
                                                alt={u.firstName + ' ' + u.lastName} />}
                                        <Link to={'/' + u.username}>
                                            <div className="users-list-name">{u.firstName + ' ' + u.lastName}</div>
                                        </Link>
                                    </div>
                                    <div className="users-list-btns">
                                        {u.friends.includes(user._id) ? <button className="btn btn-red" onClick={() => { handleRequest('delete', u.username) }}>Delete Friend</button> :
                                        u.requests.received.includes(user._id) ? <button className="btn btn-red" onClick={() => { handleRequest('deleteSent', u.username) }}>Cancel Friend Request</button> :
                                        u.requests.sent.includes(user._id) ?
                                            <div>
                                                <button className="btn btn-blue" onClick={() => { handleRequest('add', u.username) }}>Accept Request</button>
                                                <button className="btn btn-red" onClick={() => { handleRequest('deleteReceived', u.username) }}>Delete Request</button>
                                            </div>
                                        :
                                            <button className="btn btn-blue" onClick={() => { handleRequest('send', u.username) }}>Add Friend</button>}
                                    </div>
                                </div>
                            : null
                        )
                    })}
                </div>
            : null}
        </main>
    )
};

export default Users;