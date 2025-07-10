import { useState } from "react";
import { useAuth } from "./lib/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const avatars = [

  "/avatars/avatar1.jpg", 
  "/avatars/avatar2.jpg",
  "/avatars/avatar3.jpg",
  "/avatars/avatar4.jpg",
  "/avatars/avatar5.jpg",
  "/avatars/avatar6.jpeg", 
  "/avatars/avatar7.jpeg",
  "/avatars/avatar8.jpeg",
  "/avatars/avatar9.jpeg",
  "/avatars/avatar10.jpeg",
];

export default function Signup() {
  const { register, setAvatar } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Controls UI between signup form and avatar picker
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  // Remove selectedAvatar and custom avatar logic
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [registeredUser, setRegisteredUser] = useState<string | null>(null);

  // Add a setUser state updater for context
  const [_, setForceUser] = useState<any>(null); // force update

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Normalize username and email
    const normalizedUsername = formData.username.trim().toLowerCase();
    const normalizedEmail = formData.email.trim().toLowerCase();

    try {
      const success = await register(normalizedUsername, formData.password, {
        email: normalizedEmail,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
      });

      if (success) {
        setRegisteredUser(normalizedUsername);
        setSuccessMessage("Account created! Please choose your avatar.");
        setError("");
        setShowAvatarPicker(true);
      } else {
        setError("Username or email already exists.");
        setSuccessMessage("");
      }
    } catch (err: any) {
      // Try to show more specific error if available
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setSuccessMessage("");
    }
  };

  // Restore handleAvatarSignup for button
  const handleAvatarSignup = async () => {
    if (!registeredUser || !selectedAvatar) return;
    try {
      await axios.post(
        "http://localhost:8000/api/set-avatar",
        {
          avatar: selectedAvatar,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAvatar(selectedAvatar);
      // Fetch latest user data and update context
      try {
        const res = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.user) {
          localStorage.setItem("currentUser", JSON.stringify(res.data.user));
          setForceUser(res.data.user); // force rerender if needed
        }
      } catch (err) {
        // ignore fetch error, fallback to setAvatar
      }
      navigate("/");
    } catch (err) {
      setError("Failed to save avatar. Please try again.");
      console.error("Failed to save avatar:", err);
    }
  };

  return (
    <div
      className="w-screen h-screen bg-no-repeat bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bgSignup.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl w-full max-w-sm max-h-[1000vh] overflow-auto">
        {!showAvatarPicker ? (
          // Signup Form
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center anime-font">
              Signup for AnimeFinder
            </h2>
            {error && <p className="text-red-600 mb-3">{error}</p>}
            {successMessage && (
              <p className="text-green-600 mb-3">{successMessage}</p>
            )}
            {/* Username */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-1 text-sm"
                required
              />
            </div>
            {/* Password */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-1 text-sm"
                required
              />
            </div>
            {/* Email */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-1 text-sm"
                required
              />
            </div>
            {/* Security Question */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700">Security Question</label>
              <select
                name="securityQuestion"
                required
                className="mt-1 block w-full border rounded-md p-1 text-sm"
                value={formData.securityQuestion}
                onChange={handleChange}
              >
                <option value="">Select a question</option>
                <option value="pet">What was your first pet's name?</option>
                <option value="school">What school did you attend as a child?</option>
                <option value="city">In what city were you born?</option>
              </select>
            </div>
            {/* Security Answer */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-700">Answer</label>
              <input
                type="text"
                name="securityAnswer"
                required
                className="mt-1 block w-full border rounded-md p-1 text-sm"
                value={formData.securityAnswer}
                onChange={handleChange}
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded text-sm mb-2"
            >
              Sign Up
            </button>
          </form>
        ) : (
          // Avatar Picker
          <div>
            <h2 className="text-xl font-bold mb-4 text-orange-600 text-center">Choose Your Avatar</h2>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {avatars.map((url, idx) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`focus:outline-none border-2 rounded-full p-1 transition-all w-20 h-20 flex items-center justify-center ${selectedAvatar === url ? 'border-orange-500' : 'border-transparent'} hover:border-orange-500`}
                >
                  <img
                    src={url}
                    alt={`Avatar ${idx + 1}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={handleAvatarSignup}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded text-sm mt-2 disabled:opacity-60"
              disabled={!selectedAvatar}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
