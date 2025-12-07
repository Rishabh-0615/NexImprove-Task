import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { AlertCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const { forgetPassword } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const result = await forgetPassword(email);
    setLoading(false);

    if (result.success) {
      navigate(`/reset-password/${result.token}`);
    } else {
      setErr(result.message || "Failed to send OTP. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-w-md w-full relative z-10 backdrop-blur-sm backdrop-filter">

        {/* Header */}
        <div className="relative px-8 pt-10 pb-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">
            Daily<span className="text-white">Vegies</span>
          </h1>

          <h2 className="text-2xl font-bold text-white mt-6">
            Forgot Password?
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Enter your email to receive a reset code
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
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-3 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl focus:outline-none"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {/* Back link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-cyan-400 hover:text-indigo-400 transition"
            >
              ← Back to Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
