import { Link } from 'react-router-dom';

const Sidebar = ({user}) => {
    return (
        <ul id="sidebar">
            <li>{user.firstName + ' ' + user.lastName}</li>
            <li><Link to="/users">Find Friends</Link></li>
            <li><Link to="/friends/requests">Requests</Link></li>
        </ul>
    );
};

export default Sidebar;