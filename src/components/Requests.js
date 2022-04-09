import { useState, useEffect } from 'react';
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
            <div>
                <h1>Sent Requests</h1>
                <button onClick={() => { setType('received') }}>Received</button>
                {sent ? sent.map(request => {
                    return (
                        <div key={request._id}>
                            {request.firstName + ' ' + request.lastName}
                            <button onClick={() => handleRequest('deleteSent', request.username)}>Cancel Request</button>
                        </div>
                    )
                }) : null}
            </div>
        :
            <div>
                <h1>Received Requests</h1>
                <button onClick={() => { setType('sent') }}>Sent</button>
                {received ? received.map(request => {
                    return (
                        <div key={request._id}>
                            {request.firstName + ' ' + request.lastName}
                            <button onClick={() => handleRequest('add', request.username)}>Accept Request</button>
                            <button onClick={() => handleRequest('deleteReceived', request.username)}>Delete Request</button>
                        </div>
                    )
                }) : null}
            </div>
    );
};

export default Requests;