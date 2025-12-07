import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const { loginUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErr(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const result = await loginUser(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErr(result.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-w-md w-full relative z-10 backdrop-blur-sm backdrop-filter">

        {/* Header */}
        <div className="relative px-8 pt-10 pb-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">
            NexImprove<span className="text-white">Task</span>
          </h1>

          <h2 className="text-2xl font-bold text-white mt-6">
            Welcome Back
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Login to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">

          {/* Error */}
          {err && (
            <div className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 rounded-lg flex items-center text-sm">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              {err}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full p-3 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl focus:outline-none"
              placeholder="rishabh@gmail.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full p-3 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-neutral-400 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 bg-neutral-800 border-neutral-700 rounded mr-2 focus:ring-2 focus:ring-indigo-600"
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-cyan-400 hover:text-indigo-400 transition"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 pb-8 text-center">
          <p className="text-neutral-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-cyan-400 hover:text-indigo-400"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
