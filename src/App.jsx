import React, { useEffect } from "react";
import Home from "./pages/Home/Home";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";
import { WatchlistProvider } from "./context/WatchlistContext";
import { ContinueWatchingProvider } from "./context/ContinueWatchingContext";
import { ThemeProvider } from "./context/ThemeContext";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Logged In");
        if (location.pathname === "/login") {
          navigate("/");
        }
      } else {
        console.log("Logged Out");
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <ThemeProvider>
      <WatchlistProvider>
        <ContinueWatchingProvider>
          <div>
            <ToastContainer theme="dark" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/player/:id" element={<Player />} />
            </Routes>
          </div>
        </ContinueWatchingProvider>
      </WatchlistProvider>
    </ThemeProvider>
  );
};

export default App;
