import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), function (user) {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  function signOut() {
    const auth = getAuth();
    auth.signOut().then(() => {
      navigate("/");
    });
  }

  return { user, loading, signOut };
}
