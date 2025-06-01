import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Anime } from "./Anime";
import { Home } from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import { useAuth } from "./lib/AuthContext";
import ProtectedRoute from "./ProtectedRoute"; 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

export function App() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const hideHeader = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex flex-col w-full min-h-screen">
      {!hideHeader && (
        <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold text-emerald-600">AnimeFinder</h1>
          <nav className="space-x-4">
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            ) : (
              <button onClick={logout} className="text-red-500">Logout</button>
            )}
          </nav>
        </header>
      )}

      <main className="flex-1">
        <Routes>
          {/* 🔐 Protect Home and Search */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Card>
                  <CardContent>
                    <Anime />
                  </CardContent>
                </Card>
              </ProtectedRoute>
            }
          />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
}
