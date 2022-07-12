import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Post from './Post';
import PostForm from './PostForm';
import { getCookie } from '../helpers/cookies';

const Search = ({user, darkMode}) => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [posts, setPosts] = useState();
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
            setPosts(res);
        });
    }, [user._id, refreshToggle, category, query]);

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
            <div id="search-results">
                <h1>Search Results for: {query}</h1>
                {posts && posts.length > 0 ?
                    posts.map(post => {
                        return (
                            post.public ?
                                <Post key={post._id} user={user} post={post} updatePost={updatePost} deletePost={deletePost} />
                            : null
                        )
                    })
                : <div id="search-no-results">No results.</div>}
            </div>
            {showPostForm ?
                <PostForm user={user} post={targetPost} setShowPostForm={setShowPostForm}
                    refreshToggle={refreshToggle} setRefreshToggle={setRefreshToggle} />
            : null}
        </main>
    );
};

export default Search;