import { useState } from "react"; // Import React and useState hook
import { useParams, useLoaderData } from "react-router-dom";
import axios from "axios";
import articles from "../article-content";
import CommentsList from "../CommentsList";
import AddCommentForm from "../AddCommentForm";
import useUser from "../useUser"; // Import the useUser hook

export default function ArticlePage() {
  const params = useParams();
  const { name } = params; // Destructure the name parameter from the URL
  const { upvotes: initialUpvotes, comments: initialComments } =
    useLoaderData(); // Get the upvotes and comments from the loader data
  const article = articles.find((article) => article.name === name); // Find the article by name

  const [upvotes, setUpvotes] = useState(initialUpvotes); // State to manage upvotes
  const [comments, setComments] = useState(initialComments); // State to manage comments

  const { user } = useUser(); // Get the user from the useUser hook

  async function onUpvoteClicked() {
    const token = user && (await user.getIdToken()); // Get the user's token if available
    const headers = token ? { authtoken: token } : {}; // Set the authorization header if token is present
    const response = await axios.post(`/api/articles/${name}/upvote`, null, {
      headers,
    }); // Send a POST request to upvote the article
    const updatedArticleData = response.data; // Get the updated article data from the response
    setUpvotes(updatedArticleData.upvotes); // Update the upvotes state with the new value
  }

  async function onDownvoteClicked() {
    const token = user && (await user.getIdToken()); // Get the user's token if available
    const headers = token ? { authtoken: token } : {}; // Set the authorization header if token is present
    const response = await axios.post(`/api/articles/${name}/downvote`, null, {
      headers,
    }); // Send a POST request to downvote the article
    const updatedArticleData = response.data; // Get the updated article data from the response
    setUpvotes(updatedArticleData.upvotes); // Update the upvotes state with the new value
  }

  async function onAddCommentClicked({ postedBy, text }) {
    const token = user && (await user.getIdToken()); // Get the user's token if available
    const headers = token ? { authtoken: token } : {}; // Set the authorization header if token is present
    const response = await axios.post(
      `/api/articles/${name}/comments`,
      {
        postedBy,
        text,
      },
      { headers }
    ); // Send a POST request to add a new comment
    const updatedArticleData = response.data; // Get the updated article data from the response
    setComments(updatedArticleData.comments); // Update the comments state with the new value
  }

  async function onDeleteCommentClicked({ postedBy, text }) {
    const token = user && (await user.getIdToken()); // Get the user's token if available
    const headers = token ? { authtoken: token } : {}; // Set the authorization header if token is present
    const response = await axios.delete(`/api/articles/${name}/comments`, {
      data: { postedBy, text },
      headers,
    }); // Send a DELETE request to delete a comment
    const updatedArticleData = response.data; // Get the updated article data from the response
    setComments(updatedArticleData.comments); // Update the comments state with the new value
  }

  // Todo: Disable upvote and downvote buttons if the user has already upvoted or downvoted
  return (
    <div>
      <h1>{article.title}</h1>
      <div className="action-buttons" style={{ display: "flex", gap: "10px" }}>
        {/* Render action buttons for upvoting and downvoting */}
        {user && (
          <button
            style={{ backgroundColor: "green", opacity: 0.7, color: "white" }}
            onClick={onUpvoteClicked}
          >
            Upvote
          </button>
        )}
        {user && (
          <button
            style={{
              backgroundColor: "red",
              opacity: upvotes === 0 ? 0.3 : 0.7,
              color: "white",
              cursor: upvotes === 0 ? "not-allowed" : "pointer",
            }}
            onClick={onDownvoteClicked}
            disabled={upvotes === 0} // Disable the button if there are no upvotes
          >
            Downvote
          </button>
        )}
      </div>
      <p>
        This article has {upvotes} {upvotes > 1 ? "upvotes" : "upvote"}!
      </p>
      {article.content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p> // Render each paragraph of the article content
      ))}
      {user ? (
        <AddCommentForm onAddComment={onAddCommentClicked} />
      ) : (
        <p>Log in to add a comment</p>
      )}{" "}
      {/* Render the AddCommentForm component */}
      <CommentsList
        comments={comments}
        onDeleteComment={onDeleteCommentClicked}
      />{" "}
      {/* Render the CommentsList component */}
    </div>
  );
}

// loader function moved to a separate file (ArticlePage.loader.js)
