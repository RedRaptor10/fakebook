import { Link } from 'react-router-dom';
import checkImage from '../helpers/checkImage';
import defaultPhoto from '../assets/default-photo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({user}) => {
    return (
        <ul id="sidebar">
            <li>
                <Link to={'/' + user.username}>
                    {user.photo && checkImage(process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + user._id + '/' + user.photo) ?
                        <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + user._id + '/' + user.photo}
                            alt="" />
                    :
                        <img className="profile-photo" src={defaultPhoto} alt="" />}
                    <span>{user.firstName + ' ' + user.lastName}</span>
                </Link>
            </li>
            <li>
                <Link to="/users">
                    <FontAwesomeIcon icon={faUserGroup} />
                    Find Friends
                </Link>
            </li>
            <li>
                <Link to="/friends/requests">
                    <FontAwesomeIcon icon={faUserPlus} />
                    Requests
                </Link>
            </li>
        </ul>
    );
};

export default Sidebar;