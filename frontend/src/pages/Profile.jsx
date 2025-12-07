import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { LogOut, User2, ShieldCheck } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, loading, logoutUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neutral-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">
            User Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        
        {/* Welcome Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome, {user?.name}! 👋
          </h2>
          <p className="text-neutral-400 text-sm">
            Here's your account overview.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Profile Info */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <User2 size={20} className="text-blue-400" />
              Profile Information
            </h3>

            <div className="space-y-4 text-sm">
              <InfoItem label="Name" value={user?.name} />
              <InfoItem label="Email" value={user?.email} />
              <InfoItem label="GSTIN" value={user?.gstin} />
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <ShieldCheck size={20} className="text-green-400" />
              Account Status
            </h3>

            <div className="space-y-4 text-sm">
              <StatusItem
                label="Email Verified"
                value={user?.isVerified ? "Verified" : "Not Verified"}
                color={user?.isVerified ? "green" : "red"}
              />

              <StatusItem
                label="Admin Approved"
                value={user?.isApproved ? "Approved" : "Pending"}
                color={user?.isApproved ? "green" : "yellow"}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-5">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">

            <ActionButton
              text="Update Profile"
              gradient="from-indigo-600 to-purple-600"
            />

            <ActionButton
              text="View Reports"
              gradient="from-purple-600 to-pink-600"
            />

            <ActionButton
              text="Settings"
              gradient="from-green-600 to-emerald-600"
            />

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-neutral-500">{label}</p>
    <p className="text-white font-medium">{value || "--"}</p>
  </div>
);

const StatusItem = ({ label, value, color }) => {
  const colors = {
    green: "bg-green-500/10 text-green-300",
    yellow: "bg-yellow-500/10 text-yellow-300",
    red: "bg-red-500/10 text-red-300",
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-neutral-400">{label}</p>

      <span className={`px-3 py-1 rounded-full font-medium text-xs ${colors[color]}`}>
        {value}
      </span>
    </div>
  );
};

const ActionButton = ({ text, gradient }) => (
  <button
    className={`
      w-full py-3 px-4 rounded-xl text-white font-medium shadow-md 
      bg-gradient-to-r ${gradient} hover:opacity-90 transition
    `}
  >
    {text}
  </button>
);
