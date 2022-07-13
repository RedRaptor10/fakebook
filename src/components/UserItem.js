import { Link } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';
import checkImage from '../helpers/checkImage';
import defaultPhoto from '../assets/default-photo.jpg';

const UserItem = ({user, setUser, item}) => {
    const handleRequest = (action, username) => {
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
            document.cookie = 'fakebook_api_token=' + res.token + '; SameSite=Lax; path=/';
        });
    };

    return (
        user._id !== item._id ?
            <div key={item._id} className="users-list-user">
                <div className="users-list-info">
                    <Link to={'/' + item.username}>
                        {item.photo && checkImage(process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + item._id + '/' + item.photo) ?
                            <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + item._id + '/' + item.photo}
                                alt="" />
                        :
                            <img className="profile-photo" src={defaultPhoto} alt="" />}
                    </Link>
                    <Link to={'/' + item.username}>
                        <div className="users-list-name">{item.firstName + ' ' + item.lastName}</div>
                    </Link>
                </div>
                <div className="users-list-btns">
                    {item.friends.includes(user._id) ? <button className="btn btn-red" onClick={() => { handleRequest('delete', item.username) }}>Delete Friend</button> :
                    item.requests.received.includes(user._id) ? <button className="btn btn-red" onClick={() => { handleRequest('deleteSent', item.username) }}>Cancel Friend Request</button> :
                    item.requests.sent.includes(user._id) ?
                        <div>
                            <button className="btn btn-blue" onClick={() => { handleRequest('add', item.username) }}>Accept Request</button>
                            <button className="btn btn-red" onClick={() => { handleRequest('deleteReceived', item.username) }}>Delete Request</button>
                        </div>
                    :
                        <button className="btn btn-blue" onClick={() => { handleRequest('send', item.username) }}>Add Friend</button>}
                </div>
            </div>
        : null
    );
};

export default UserItem;