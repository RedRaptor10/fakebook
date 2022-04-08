import { Link } from 'react-router-dom';

const Sidebar = ({user}) => {
    return (
        <ul id="sidebar">
            <li>{user.firstName + ' ' + user.lastName}</li>
            <li>Friends</li>
            <li><Link to="/friends/requests">Requests</Link></li>
        </ul>
    );
};

export default Sidebar;