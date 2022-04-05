import Header from './Header';
import Sidebar from './Sidebar';
import Timeline from './Timeline';
import Contacts from './Contacts';
import LogInForm from './LogInForm';

const Home = ({user, setUser}) => {

    return (
        user ?
            <div id="home">
                <Header user={user} setUser={setUser} />
                <main>
                    <Sidebar user={user} />
                    <Timeline />
                    <Contacts />
                </main>
            </div>
        :
            <LogInForm user={user} setUser={setUser} />
    );
};

export default Home;