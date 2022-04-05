import Header from './Header';
import LogInForm from './LogInForm';

const Home = ({user, setUser}) => {

    return (
        <main id="home">
            {user ?
                <Header setUser={setUser} />
            :
                <LogInForm user={user} setUser={setUser} />
            }
        </main>
    );
};

export default Home;