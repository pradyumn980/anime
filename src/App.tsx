import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Anime } from "./Anime";
import { Home } from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import { useAuth } from "./lib/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { AnimeDetails } from "./AnimeDetails";
import { Profile } from "./Profile";
import { useEffect, useState } from "react";

export function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeader = location.pathname === "/login" || location.pathname === "/signup";

  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setAvatar(parsed.avatar || null);
    }
  }, [location]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {!hideHeader && (
        <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold text-emerald-600">AnimeFinder</h1>
          <nav className="space-x-4 flex items-center">
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>

            {!isAuthenticated ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            ) : (
              avatar && (
                <img
                  src={avatar}
                  alt="User Avatar"
                  title="View Profile"
                  className="w-10 h-10 rounded-full border-2 border-orange-500 ml-4 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate("/profile")}
                />
              )
            )}
          </nav>
        </header>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Anime /></ProtectedRoute>} />
          <Route path="/anime/:id" element={<ProtectedRoute><AnimeDetails /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
}
