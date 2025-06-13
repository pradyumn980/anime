import { useState } from "react";
import { useAuth } from "./lib/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const avatars = [
  "/avatars/avatar1.jpg", // fixed folder name
  "/avatars/avatar2.jpg",
  "/avatars/avatar3.jpg",
  "/avatars/avatar4.jpg",
  "/avatars/avatar5.jpg",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [registeredUser, setRegisteredUser] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await register(formData.username, formData.password, {
        email: formData.email,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
      });

      if (success) {
        setRegisteredUser(formData.username);
        setSuccessMessage("Account created! Please choose your avatar.");
        setError("");
        setShowAvatarPicker(true);
      } else {
        setError("Username already exists.");
        setSuccessMessage("");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleSelectAvatar = async (url: string) => {
    if (!registeredUser) return;

    try {
      // Save avatar to backend
      const res = await axios.post(
        "http://localhost:8000/api/set-avatar",
        {
          avatar: url,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.user._id) {
       navigate("/");
      }
    } catch (err) {
      console.error("Failed to save avatar:", err);
    }
  };

  return (
    <div
      className="w-screen h-screen bg-no-repeat bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bgSignup.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md">
        {!showAvatarPicker ? (
          // Signup Form
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold mb-6 text-orange-600 text-center anime-font">
              Signup for AnimeFinder
            </h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}
            {successMessage && (
              <p className="text-green-600 mb-4">{successMessage}</p>
            )}

            {/* Username */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            {/* Security Question */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Security Question
              </label>
              <select
                name="securityQuestion"
                required
                className="mt-1 block w-full border rounded-md p-2"
                value={formData.securityQuestion}
                onChange={handleChange}
              >
                <option value="">Select a question</option>
                <option value="pet">What was your first pet's name?</option>
                <option value="school">
                  What school did you attend as a child?
                </option>
                <option value="city">In what city were you born?</option>
              </select>
            </div>

            {/* Security Answer */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Answer
              </label>
              <input
                type="text"
                name="securityAnswer"
                required
                className="mt-1 block w-full border rounded-md p-2"
                value={formData.securityAnswer}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded"
            >
              Signup
            </button>

            {/* Login and Reset Password Links */}
            <p className="mt-4 text-sm text-center text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-600 hover:underline">
                Login
              </Link>
            </p>
            <p className="mt-2 text-sm text-center">
              <Link
                to="/reset-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          </form>
        ) : (
          // Avatar Picker
          <div>
            <h2 className="text-2xl font-bold text-orange-600 text-center mb-4">
              Choose Your Avatar
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {avatars.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="avatar"
                  className="w-24 h-24 object-cover rounded-full cursor-pointer border-2 hover:border-orange-500"
                  onClick={() => handleSelectAvatar(url)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
