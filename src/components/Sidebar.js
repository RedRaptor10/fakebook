const Sidebar = ({user}) => {
    return (
        <ul id="sidebar">
            <li>{user.firstName + ' ' + user.lastName}</li>
            <li>Friends</li>
        </ul>
    );
};

export default Sidebar;