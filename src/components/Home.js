import Sidebar from './Sidebar';
import Timeline from './Timeline';
import Contacts from './Contacts';

const Home = ({user, darkMode}) => {
    return (
        <main id="home" className={darkMode ? 'dark' : null}>
            <Sidebar user={user} />
            <Timeline user={user} />
            <Contacts user={user} />
        </main>
    );
};

export default Home;