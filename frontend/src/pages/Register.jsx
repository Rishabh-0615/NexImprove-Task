import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { AlertCircle, ChevronRight } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gstin: "",
    password: "",
    confirmPassword: "",
  });

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const { registerUser, verifyOtp } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErr(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr(null);

    if (formData.password !== formData.confirmPassword) {
      return setErr("Passwords do not match.");
    }

    setLoading(true);
    const result = await registerUser(
      formData.name,
      formData.email,
      formData.gstin,
      formData.password
    );
    setLoading(false);

    if (result.success) {
      setToken(result.token);
      setStep(2);
    } else {
      setErr(result.message || "Registration failed. Try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const result = await verifyOtp(token, otp);
    setLoading(false);

    if (result.success) {
      setTimeout(() => navigate("/login"), 1200);
    } else {
      setErr(result.message || "Invalid OTP. Try again.");
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
            {step === 1 ? "Create Account" : "Verify Email"}
          </h2>
        </div>

        {/* FORM CARD */}
        <div className="px-8 pb-8 space-y-6">

          {/* Error Message */}
          {err && (
            <div className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 rounded-lg flex items-center text-sm">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              {err}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-5">

              {[
                { label: "Full Name", name: "name", type: "text", placeholder: "Rishabh Sharma" },
                { label: "Email Address", name: "email", type: "email", placeholder: "rishabh@gmail.com" },
                { label: "GSTIN Number", name: "gstin", type: "text", placeholder: "27AAPFU0939F1ZV" },
                { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
                { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "••••••••" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="block w-full p-3 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl focus:outline-none"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Register"}
              </button>

            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-300">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="block w-full text-center text-xl tracking-widest p-3 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl focus:outline-none"
                  placeholder="000000"
                />
                <p className="text-neutral-500 text-xs text-center">
                  Check your email for the verification code
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 px-4 rounded-xl text-neutral-200 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
              >
                Back to Registration
              </button>

            </form>
          )}

          {/* Footer */}
          <div className="text-center">
            <p className="text-neutral-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-indigo-400"
              >
                Login here
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;
