import { Link, useNavigate } from 'react-router-dom';
import { deleteCookie } from '../helpers/cookies';

const Header = ({setUser}) => {
    const navigate = useNavigate();

    const logOut = () => {
        fetch(process.env.REACT_APP_SERVER + 'api/log-out', { mode: 'cors' })
        .then(function() {
            setUser();
            deleteCookie('odinbook_api_token');
            navigate('/');
        });
    };

    return (
        <header>
            <h1>
                <Link to="/">odinbook</Link>
            </h1>
            <button onClick={logOut}>Log Out</button>
        </header>
    );
};

export default Header;