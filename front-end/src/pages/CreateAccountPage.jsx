import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "../App.css"; // Import CSS styles

export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleCreateAccount() {
    const auth = getAuth();
    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/articles");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="login-form-container">
      <h1>Create Account</h1>
      {error && <p className="error">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateAccount();
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
        <input  
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Create Account</button>
      </form>
      <div className="login-links">
        <Link to="/login">Already have an account? Log in here!</Link>
        <Link to="/">Back to home</Link>
      </div>
    </div>
  );
}
