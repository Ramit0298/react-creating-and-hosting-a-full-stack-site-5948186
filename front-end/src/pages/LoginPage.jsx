import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../App.css"; // Import CSS styles

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/articles");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="login-form-container">
      <h1>Log In</h1>
      {error && <p className="error">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="login-form"
      >
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
      <div className="login-links">
        <Link to="/create-account">
          Don&apos;t have an account? Create one here!
        </Link>
        <Link to="/">Back to home</Link>
      </div>
    </div>
  );
}
