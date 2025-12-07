import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { LogOut, RefreshCw } from "lucide-react";

const AdminDashboard = () => {
  const {
    admin,
    isAuthenticated,
    loading,
    logoutAdmin,
    getUnverifiedUsers,
    approveUser,
  } = useAdmin();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    const result = await getUnverifiedUsers();
    setLoadingUsers(false);

    if (result.success) {
      setUsers(result.users || []);
    }
  };

  const handleApprove = async (userId) => {
    const result = await approveUser(userId);
    if (result.success) {
      loadUsers();
    }
  };

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      navigate("/admin/login");
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

          <div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Admin Dashboard
            </h1>
            <p className="text-neutral-400 text-sm">
              Logged in as: {admin?.email}
            </p>
          </div>

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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <StatCard
            title="Pending Approvals"
            value={users.length}
            color="yellow"
          />

          <StatCard
            title="Total Users"
            value="--"
            color="blue"
          />

          <StatCard
            title="System Status"
            value="Active"
            color="green"
          />
        </div>

        {/* Pending Users Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Pending User Approvals
            </h2>

            <button
              onClick={loadUsers}
              disabled={loadingUsers}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
            >
              <RefreshCw size={16} className={loadingUsers ? "animate-spin" : ""} />
              {loadingUsers ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loadingUsers ? (
            <div className="p-8 text-center text-neutral-400">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-neutral-400">
              <p className="text-lg">No pending approvals ✔️</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-800">
                  <tr>
                    {["Name", "Email", "GSTIN", "Registered", "Action"].map((head) => (
                      <th
                        key={head}
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-800">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-neutral-800/50 transition"
                    >
                      <td className="px-6 py-3 font-medium text-white">
                        {user.name}
                      </td>
                      <td className="px-6 py-3 text-neutral-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-3 text-neutral-400">
                        {user.gstin}
                      </td>
                      <td className="px-6 py-3 text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-sm font-medium transition"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;

const StatCard = ({ title, value, color }) => {
  const colors = {
    yellow: "text-yellow-300 bg-yellow-500/10",
    blue: "text-blue-300 bg-blue-500/10",
    green: "text-green-300 bg-green-500/10",
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-400 text-sm">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${colors[color].split(" ")[0]}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${colors[color].split(" ")[1]}`}>
          {/* Simple indicator dot */}
          <div className={`h-4 w-4 rounded-full ${colors[color].split(" ")[0]}`} />
        </div>
      </div>
    </div>
  );
};
