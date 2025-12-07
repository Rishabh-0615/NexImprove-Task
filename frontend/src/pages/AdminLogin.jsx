import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { AlertCircle } from "lucide-react";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErr(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const result = await loginAdmin(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setErr(result.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full relative z-10 backdrop-blur-sm backdrop-filter">

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Admin<span className="text-white">Panel</span>
          </h1>

          <h2 className="text-xl font-semibold text-white mt-4">
            Administrator Login
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Secure access required
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
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              className="block w-full p-3 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl focus:outline-none"
              placeholder="admin@example.com"
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
              required
              onChange={handleChange}
              className="block w-full p-3 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>
        </form>

        {/* Info Box */}
        <div className="px-8 pb-8">
          <div className="p-4 bg-neutral-800 border border-neutral-700 rounded-xl text-center">
            <p className="text-neutral-400 text-sm">
              🔒 Authorized personnel only
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
