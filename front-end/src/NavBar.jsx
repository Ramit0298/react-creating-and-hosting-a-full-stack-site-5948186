import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "./useUser";

export default function NavBar() {
  const navigate = useNavigate();
  const { isLoading, user } = useUser();

  async function handleSignOut() {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  return (
    // If we use anchor tags instead of Link, the page will refresh and we will lose the state of the application.
    // The Link component is a special version of the anchor tag that is used to navigate between pages in a single-page application.
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/articles">Articles</Link>
        </li>
        <li className="navbar-item">
          <Link to="/about">About</Link>
        </li>
        {isLoading ? (
          <li className="navbar-item">Loading...</li>
        ) : (
          <>
            {user && (
              <li className="navbar-item" style={{ color: "white" }}>
                {/* <p style={{ color: "white", display: "inline-block" }}>{email}</p> */}
                Logged in as {user.email}
              </li>
            )}
            <li className="navbar-item">
              {user ? (
                // <button onClick={signOut}>Sign Out</button>
                <button onClick={handleSignOut}>Sign Out</button>
              ) : (
                <button onClick={() => navigate("/login")}>Sign In</button>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
