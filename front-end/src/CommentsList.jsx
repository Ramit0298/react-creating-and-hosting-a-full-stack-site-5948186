import "./App.css"; // Import CSS styles
import PropTypes from "prop-types";
import useUser from "./useUser"; // Import the useUser hook

export default function CommentsList({ comments, onDeleteComment }) {
  const { user } = useUser();
  console.log("User:", user); // Log the user object to the console
  console.log("Comments:", comments); // Log the comments array to the console

  // Todo: Add a delete button to each comment that allows the user to delete their own comments
  return (
    <>
      <h3>Comments</h3>
      {comments.map((comment, index) => (
        <div className="comment-card" key={index}>
          <div className="comment-header">
            <h4>{comment.postedBy}</h4>
          </div>
          <div className="comment-body">
            <p>{comment.text}</p>
            <button
              onClick={() => onDeleteComment(comment)}
              className="delete-comment-btn"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

CommentsList.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      postedBy: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDeleteComment: PropTypes.func.isRequired,
};
