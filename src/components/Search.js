import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Post from './Post';
import PostForm from './PostForm';
import UserItem from './UserItem';
import { getCookie } from '../helpers/cookies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faUser } from '@fortawesome/free-solid-svg-icons';

const Search = ({user, setUser, darkMode}) => {
    let { category } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [posts, setPosts] = useState();
    const [users, setUsers] = useState();
    const [showPostForm, setShowPostForm] = useState(false);
    const [targetPost, setTargetPost] = useState();
    const [refreshToggle, setRefreshToggle] = useState(false);

    // Get Search Results
    useEffect(() => {
        let token = getCookie('fakebook_api_token');

        const options = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/search/' + category + '?q=' + query, options)
        .then(function(res) {
            return res.json();
        })
        .then(function(res) {
            if (category === 'posts') {
                setPosts(res);
            } else if (category === 'users') {
                setUsers(res);
            }
        });
    }, [user, refreshToggle, category, query]);

    const updatePost = post => {
        document.body.classList.add('disable-scroll');
        setTargetPost(post);
        setShowPostForm(true);
    };

    const deletePost = post => {
        let token = getCookie('fakebook_api_token');

        const options = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/posts/' + post._id + '/delete', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            refreshToggle ? setRefreshToggle(false) : setRefreshToggle(true);
        });
    };

    return (
        <main id="search" className={darkMode ? 'dark' : null}>
            <ul id="search-categories">
                <h2>Filters</h2>
                <li className={category === 'posts' ? 'category-active' : null}>
                    <Link to={'/search/posts?q=' + query}>
                        <FontAwesomeIcon icon={faMessage} />
                        Posts
                    </Link>
                </li>
                <li className={category === 'users' ? 'category-active' : null}>
                    <Link to={'/search/users?q=' + query}>
                        <FontAwesomeIcon icon={faUser} />
                        People
                    </Link>
                </li>
            </ul>
            <div id="search-results">
                <h1>Search Results for: {query}</h1>
                {category === 'posts' && posts && posts.length > 0 ?
                    posts.map(post => {
                        return (
                            post.public ?
                                <Post key={post._id} user={user} post={post} updatePost={updatePost} deletePost={deletePost} />
                            : null
                        )
                    })
                :
                category === 'users' && users && users.length > 0 ?
                    <div id="users-list">
                        {users.map(u => {
                            return (
                                <UserItem key={u._id} user={user} setUser={setUser} item={u} />
                            );
                        })}
                    </div>
                :
                    <div id="search-no-results">No results.</div>}
            </div>
            {showPostForm ?
                <PostForm user={user} post={targetPost} setShowPostForm={setShowPostForm}
                    refreshToggle={refreshToggle} setRefreshToggle={setRefreshToggle} />
            : null}
        </main>
    );
};

export default Search;