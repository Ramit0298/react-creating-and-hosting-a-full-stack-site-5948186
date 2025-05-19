import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXkj4JL_SoAAnKXk6B_3yXPSVWsrkJSio",
  authDomain: "full-stack-react-app-2a674.firebaseapp.com",
  projectId: "full-stack-react-app-2a674",
  storageBucket: "full-stack-react-app-2a674.firebasestorage.app",
  messagingSenderId: "29348383762",
  appId: "1:29348383762:web:186c55a72a459234549ccb",
};

// Initialize Firebase
initializeApp(firebaseConfig);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
