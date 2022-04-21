import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';

const Requests = ({user, setUser}) => {
    const [sent, setSent] = useState();
    const [received, setReceived] = useState();
    const [type, setType] = useState('received');

    // Get additional Requests info on mount & update
    useEffect(() => {
        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/get-requests/' + type, options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (type === 'sent') { setSent(res); }
            else if (type === 'received') { setReceived(res); }
        });
    }, [user, type]);

    const handleRequest = (action, username) => {
        let subroute;
        if (action === 'add') { subroute = '/add-friend' }
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
            // Set User state and update token
            setUser(res.user);
            document.cookie = 'odinbook_api_token=' + res.token + '; SameSite=Lax; path=/';
        });
    };

    return (
        type === 'sent' ?
            <main id="requests-sent">
                <h1>Sent Requests</h1>
                <button id="change-view-btn" onClick={() => { setType('received') }}>View Received Requests</button>
                {sent ?
                    <div id="requests-list">
                        {sent.map(request => {
                            return (
                                <div key={request._id} className="requests-list-user">
                                    <div className="requests-list-info">
                                        {request.photo ?
                                            <img className="profile-photo" src={process.env.REACT_APP_SERVER + "/uploads/profile-photos/" + request._id + "/" + request.photo}
                                                alt={request.firstName + ' ' + request.lastName} />
                                        :
                                            <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/default.jpg'}
                                                alt={request.firstName + ' ' + request.lastName} />}
                                        <Link to={'/' + request.username}>
                                            <div className="requests-list-name">{request.firstName + ' ' + request.lastName}</div>
                                        </Link>
                                    </div>
                                    <div className="requests-list-btns">
                                        <button className="btn btn-red" onClick={() => handleRequest('deleteSent', request.username)}>Cancel Request</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                : null}
            </main>
        :
            <main id="requests-received">
                <h1>Received Requests</h1>
                <button id="change-view-btn" onClick={() => { setType('sent') }}>View Sent Requests</button>
                {received ?
                    <div id="requests-list">
                        {received.map(request => {
                            return (
                                <div key={request._id} className="requests-list-user">
                                    <div className="requests-list-info">
                                        {request.photo ?
                                            <img className="profile-photo" src={process.env.REACT_APP_SERVER + "/uploads/profile-photos/" + request._id + "/" + request.photo}
                                                alt={request.firstName + ' ' + request.lastName} />
                                        :
                                            <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/default.jpg'}
                                                alt={request.firstName + ' ' + request.lastName} />}
                                        <Link to={'/' + request.username}>
                                            <div className="requests-list-name">{request.firstName + ' ' + request.lastName}</div>
                                        </Link>
                                    </div>
                                    <div className="requests-list-btns">
                                        <button className="btn btn-blue" onClick={() => handleRequest('add', request.username)}>Accept Request</button>
                                        <button className="btn btn-red" onClick={() => handleRequest('deleteReceived', request.username)}>Delete Request</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                : null}
            </main>
    );
};

export default Requests;