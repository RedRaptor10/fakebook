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

        const promises = [];

        if (type === 'sent') {
            // Calling asynchronous fetch in loop requires Promises
            user.requests.sent.forEach(sent => {
                promises.push(new Promise(resolve => {
                    fetch(process.env.REACT_APP_SERVER + 'api/users/id/' + sent, options)
                    .then(function(res) { return res.json(); })
                    .then(function(res) {
                        resolve({
                            _id: res._id,
                            username: res.username,
                            firstName: res.firstName,
                            lastName: res.lastName,
                            pic: res.pic
                        });
                    });
                }))
            });
        } else if (type === 'received') {
            user.requests.received.forEach(received => {
                promises.push(new Promise(resolve => {
                    fetch(process.env.REACT_APP_SERVER + 'api/users/id/' + received, options)
                    .then(function(res) { return res.json(); })
                    .then(function(res) {
                        resolve({
                            _id: res._id,
                            username: res.username,
                            firstName: res.firstName,
                            lastName: res.lastName,
                            pic: res.pic
                        });
                    });
                }))
            });
        }

        // Fetch loop finished, condensate promises into single promise
        Promise.all(promises).then(results => {
            const temp = [];

            results.forEach(result => {
                temp.push(result);
            });

            if (type === 'sent') {
                setSent(temp);
            } else if (type === 'received') {
                setReceived(temp);
            }
        });
    }, [user, type, user.requests.sent, user.requests.received]);

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
            setUser(res.user);
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