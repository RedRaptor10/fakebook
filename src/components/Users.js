import { useState, useEffect } from 'react';
import UserItem from './UserItem';
import { getCookie } from '../helpers/cookies';

const Users = ({user, setUser, darkMode}) => {
    const [users, setUsers] = useState();

    // Get Users
    useEffect(() => {
        let token = getCookie('fakebook_api_token');

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

    return (
        <main id="users" className={darkMode ? 'dark' : null}>
            <h1>Find Friends</h1>
            {users ?
                <div id="users-list">
                    {users.map(u => {
                        return (
                            <UserItem key={u._id} user={user} setUser={setUser} item={u} />
                        )
                    })}
                </div>
            : null}
        </main>
    )
};

export default Users;