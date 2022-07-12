import { Link, useNavigate } from 'react-router-dom';
import { deleteCookie } from '../helpers/cookies';
import checkImage from '../helpers/checkImage';
import defaultPhoto from '../assets/default-photo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

const Header = ({user, setUser, darkMode, setDarkMode}) => {
    const navigate = useNavigate();

    const logOut = () => {
        fetch(process.env.REACT_APP_SERVER + 'api/log-out', { mode: 'cors' })
        .then(function() {
            setUser();
            deleteCookie('fakebook_api_token');
            navigate('/');
        });
    };

    const toggleDarkMode = () => {
        darkMode ? setDarkMode(false) : setDarkMode(true);
    };

    return (
        <header className={darkMode ? 'dark' : null}>
            <h1>
                <Link to="/">fakebook</Link>
            </h1>
            <div id="header-items">
                <div id="dark-mode-btn-container" onClick={toggleDarkMode}>
                    <button id="dark-mode-btn" type="button">
                        <div id="dark-mode-btn-switch"></div>
                    </button>
                    <FontAwesomeIcon icon={faMoon} />
                </div>
                <Link to={'/' + user.username} id="header-name">
                    {user.photo && checkImage(process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + user._id + '/' + user.photo) ?
                        <img className="profile-photo" src={process.env.REACT_APP_SERVER + '/uploads/profile-photos/' + user._id + '/' + user.photo}
                            alt="" />
                    :
                        <img className="profile-photo" src={defaultPhoto} alt="" />}
                    {user.firstName}
                </Link>
                <button id="log-out-btn" onClick={logOut}>Log Out</button>
            </div>
        </header>
    );
};

export default Header;