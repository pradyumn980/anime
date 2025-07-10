import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./lib/AuthContext"; // your custom AuthContext

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showExtraOptions, setShowExtraOptions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(username, password);
    if (!success) {
      setError("Invalid credentials. Try again.");
      setShowExtraOptions(true);
    } else {
      setError("");
      navigate("/"); // redirect to home on success
    }
  };

  return (
    <div
      className="w-screen h-screen bg-no-repeat bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in"
      >
        <h2 className="text-4xl font-bold mb-6 text-orange-600 text-center anime-font">
          Login to AnimeFinder
        </h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded-md p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 block w-full border rounded-md p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded"
        >
          Login
        </button>

        <div className="mt-4 text-sm text-center">
          <span>Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 underline">
              Sign up
            </a>
          </span>
        </div>

        {showExtraOptions && (
          <div className="mt-4 text-sm text-center">
            <p>
              Forgot password?{" "}
              <a href="/reset" className="text-blue-600 underline">
                Reset here
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
