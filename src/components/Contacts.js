import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';

const Contacts = ({user}) => {
    const [contacts, setContacts] = useState();

    // Get Friends
    useEffect(() => {
        let token = getCookie('fakebook_api_token');

        const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/users/' + user.username + '/get-friends', options)
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            setContacts(res);
        });
    }, [user.username]);

    return (
        <div id="contacts">
            <h3>Contacts</h3>
            {contacts ?
                <ul id="contacts-list">
                    {contacts.map(contact => {
                        return (
                            <li key={contact._id}>
                                <Link to={'/' + contact.username}>
                                    {contact.photo ?
                                        <img className="profile-photo"
                                            src={process.env.REACT_APP_SERVER + "/uploads/profile-photos/" + contact._id + "/" + contact.photo}
                                            alt={contact.firstName + ' ' + contact.lastName} />
                                    :
                                        <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/default.jpg'}
                                            alt={contact.firstName + ' ' + contact.lastName} />}
                                    <span>{contact.firstName + ' ' + contact.lastName}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            : null}
        </div>
    );
};

export default Contacts;