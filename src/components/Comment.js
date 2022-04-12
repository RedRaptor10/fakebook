import CommentForm from './CommentForm';
import { getCookie } from '../helpers/cookies';

const Comment = ({user, post, comment, targetComment, setTargetComment, showCommentForm, setShowCommentForm, refreshToggle, setRefreshToggle}) => {
    const updateComment = () => {
        setTargetComment(comment);
        setShowCommentForm(true);
    };

    const cancelUpdate = () => {
        setTargetComment();
        setShowCommentForm(false);
    };

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
            {comment.author && user._id === comment.author._id && targetComment === comment && showCommentForm ?
                <div>
                    <CommentForm user={user} post={post} comment={comment}
                        refreshToggle={refreshToggle} setRefreshToggle={setRefreshToggle} />
                    <button onClick={cancelUpdate}>Cancel</button>
                </div>
            :
                <div>
                    {comment.content}
                    {comment.author && user._id === comment.author._id ?
                        <div>
                            <button onClick={updateComment}>Edit</button>
                            <button onClick={deleteComment}>Delete</button>
                        </div>
                    : null}
                </div>
            }
        </div>
    )
};

export default Comment;