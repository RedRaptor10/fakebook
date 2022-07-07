import { Link, useNavigate } from 'react-router-dom';
import { deleteCookie } from '../helpers/cookies';
import checkImage from '../helpers/checkImage';
import defaultPhoto from '../assets/default-photo.jpg';

const Header = ({user, setUser}) => {
    const navigate = useNavigate();

    const logOut = () => {
        fetch(process.env.REACT_APP_SERVER + 'api/log-out', { mode: 'cors' })
        .then(function() {
            setUser();
            deleteCookie('fakebook_api_token');
            navigate('/');
        });
    };

    return (
        <header>
            <h1>
                <Link to="/">fakebook</Link>
            </h1>
            <div id="header-items">
                <Link to={'/' + user.username}>
                    {user.photo && checkImage(process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + user._id + '/' + user.photo) ?
                        <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + user._id + '/' + user.photo}
                            alt="" />
                    :
                        <img className="profile-photo" src={defaultPhoto} alt="" />}
                </Link>
                <Link to={'/' + user.username} id="header-name">{user.firstName}</Link>
                <button onClick={logOut}>Log Out</button>
            </div>
        </header>
    );
};

export default Header;