import { getCookie } from '../helpers/cookies';

const Comment = ({comment, refreshToggle, setRefreshToggle}) => {
    const deleteComment = () => {
        let token = getCookie('odinbook_api_token');

        const options = {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            mode: 'cors'
        };

        fetch(process.env.REACT_APP_SERVER + 'api/comments/' + comment._id + '/delete', options)
        .then(function(res) { return res.json(); })
        .then(function(res) {
            refreshToggle ? setRefreshToggle(false) : setRefreshToggle(true);
        });
    };

    return (
        <div>
            {comment.content}
            <button onClick={deleteComment}>Delete</button>
        </div>
    )
};

export default Comment;