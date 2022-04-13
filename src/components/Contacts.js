import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';

const Contacts = ({user}) => {
    const [contacts, setContacts] = useState();

    // Get Friends
    useEffect(() => {
        let token = getCookie('odinbook_api_token');

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
                contacts.map(contact => {
                    return (
                        <Link key={contact._id} to={'/' + contact.username}>
                            {contact.firstName + ' ' + contact.lastName}
                        </Link>
                    )
                })
            : null}
        </div>
    );
};

export default Contacts;