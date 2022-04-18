import { Link } from 'react-router-dom';

const Sidebar = ({user}) => {
    return (
        <ul id="sidebar">
            <li>
                <Link to={'/' + user.username}>
                    {user.photo ?
                        <img className="profile-photo" src={process.env.REACT_APP_SERVER + "/uploads/profile-photos/" + user._id + "/" + user.photo}
                            alt={user.firstName + ' ' + user.lastName} />
                    :
                        <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/default.jpg'}
                            alt={user.firstName + ' ' + user.lastName} />}
                    <span>{user.firstName + ' ' + user.lastName}</span>
                </Link>
            </li>
            <li><Link to="/users">Find Friends</Link></li>
            <li><Link to="/friends/requests">Requests</Link></li>
        </ul>
    );
};

export default Sidebar;