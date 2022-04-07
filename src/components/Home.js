import Sidebar from './Sidebar';
import Timeline from './Timeline';
import Contacts from './Contacts';
import LogInForm from './LogInForm';

const Home = ({user, setUser}) => {

    return (
        user ?
            <main id="home">
                <Sidebar user={user} />
                <Timeline />
                <Contacts />
            </main>
        :
            <LogInForm user={user} setUser={setUser} />
    );
};

export default Home;