import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { AlertCircle } from "lucide-react";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const { token } = useParams();
  const { resetPassword } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErr(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setErr("Passwords do not match.");
    }

    setLoading(true);
    const result = await resetPassword(token, formData.otp, formData.password);
    setLoading(false);

    if (result.success) {
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setErr(result.message || "Reset failed. Try again.");
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
            Reset Password
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Enter OTP and create a new password
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

          {/* OTP */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">
              OTP Code
            </label>
            <input
              type="text"
              name="otp"
              maxLength={6}
              value={formData.otp}
              required
              onChange={handleChange}
              className="block w-full text-center text-xl tracking-widest p-3 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl focus:outline-none"
              placeholder="000000"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">
              New Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full p-3 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full p-3 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
