import { useState } from "react"; // Import React and useState hook
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import "./App.css"; // Import CSS styles

export default function AddCommentForm({ onAddComment }) {
  const [name, setName] = useState(""); // State to manage the name input
  const [comment, setComment] = useState(""); // State to manage the comment input

  // Function to handle the submission of the comment form
  function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    onAddComment({ postedBy: name, text: comment }); // Call the onAddComment function with the name and comment
    setName(""); // Clear the name input
    setComment(""); // Clear the comment input
  }

  return (
    <div className="add-comment-form">
      <h3>Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Comment:
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}

AddCommentForm.propTypes = {
  onAddComment: PropTypes.func.isRequired,
};
