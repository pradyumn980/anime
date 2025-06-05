// src/Profile.tsx
import { useAuth } from "./lib/AuthContext";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!isAuthenticated || !user) {
    return <p className="text-white p-6">You are not logged in.</p>;
  }

  return (
    <div className="bg-[#0f172a] min-h-screen text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">👤 User Profile</h1>

      <div className="bg-[#1f2937] rounded-xl p-6 shadow-lg max-w-xl">
        {/* Avatar */}
        {user.avatar && (
          <div className="flex justify-center mb-6">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-orange-400 shadow-lg"
            />
          </div>
        )}

        <p className="text-lg mb-4">
          <span className="font-semibold text-emerald-300">Username:</span> {user.username}
        </p>
        <p className="text-lg mb-4">
          <span className="font-semibold text-emerald-300">Email:</span> {user.metadata?.email || "N/A"}
        </p>
        <p className="text-lg mb-4">
          <span className="font-semibold text-emerald-300">Security Question:</span>{" "}
          {user.metadata?.securityQuestion || "N/A"}
        </p>
        <p className="text-lg mb-4">
          <span className="font-semibold text-emerald-300">Answer:</span> {user.metadata?.securityAnswer || "N/A"}
        </p>

        <Button
          variant="outline"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-6 text-orange-500 border-orange-500 hover:bg-orange-600 hover:text-white transition"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
