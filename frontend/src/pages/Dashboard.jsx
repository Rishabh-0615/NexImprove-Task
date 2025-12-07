import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import demoData from "../data/demoApi.json";
import { Menu, X, LogOut, User, Package, TrendingUp, Globe, DollarSign } from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated, loading, logoutUser } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shipments, setShipments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (demoData?.shipments) {
      setTimeout(() => setShipments(demoData.shipments), 500);
    }
  }, []);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neutral-400 text-xl">Loading...</div>
      </div>
    );
  }

  // Calculate stats
  const totalShipments = shipments.length;
  const totalValue = shipments.reduce((sum, s) => sum + parseFloat(s.value || 0), 0);
  const activeShipments = shipments.filter(s => s.status === "In Transit").length;
  const uniqueCountries = [...new Set(shipments.map(s => s.country))].length;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
        />
      )}

      {/* Sidebar - Slides in from left */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-neutral-900 border-r border-neutral-800 shadow-xl z-40 transform transition-transform duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Profile</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="text-neutral-400 hover:text-white transition" size={24} />
            </button>
          </div>

          {/* User Data */}
          <div className="space-y-4 text-sm">
            <Info label="Name" value={user?.name} />
            <Info label="Email" value={user?.email} />
            <Info label="GSTIN" value={user?.gstin} />
          </div>

          {/* Buttons */}
          <div className="pt-6 space-y-3">

            <Link
              to="/profile"
              className="block w-full py-3 px-4 rounded-xl text-center text-white font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition text-sm"
            >
              View Full Profile
            </Link>

            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-xl text-center text-white font-medium bg-red-600 hover:bg-red-700 text-sm flex justify-center items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>

          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Hamburger Menu - Opens Sidebar */}
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={26} className="text-neutral-400 hover:text-white transition" />
          </button>

          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">
            User Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
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
            Here's your shipment activity overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            icon={<Package size={20} className="text-cyan-400" />}
            label="Total Shipments"
            value={totalShipments}
          />

          <StatCard
            icon={<TrendingUp size={20} className="text-green-400" />}
            label="Active Shipments"
            value={activeShipments}
          />

          <StatCard
            icon={<DollarSign size={20} className="text-purple-400" />}
            label="Total Value"
            value={`₹${totalValue.toLocaleString()}`}
          />

          <StatCard
            icon={<Globe size={20} className="text-indigo-400" />}
            label="Countries"
            value={uniqueCountries}
          />

        </div>

        {/* Shipments Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
          
          <div className="px-6 py-5 border-b border-neutral-800">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Package size={20} className="text-cyan-400" />
              Recent Shipments
            </h3>
            <p className="text-neutral-400 text-sm mt-1">
              Track your latest shipment activities
            </p>
          </div>

          {shipments.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">Loading demo data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-800">
                  <tr>
                    {["ID", "Exporter", "Importer", "Status", "Value", "Country"].map((head) => (
                      <th key={head} className="px-6 py-3 text-left uppercase text-xs font-medium text-neutral-400 tracking-wider">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-800">
                  {shipments.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-800/50 transition">
                      <td className="px-6 py-4 font-medium text-cyan-400">{item.id}</td>
                      <td className="px-6 py-4 text-neutral-300">{item.exporter}</td>
                      <td className="px-6 py-4 text-neutral-300">{item.importer}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 font-medium text-green-400">₹{item.value}</td>
                      <td className="px-6 py-4 text-neutral-300">{item.country}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-5">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">

            <ActionButton
              text="Create Shipment"
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

export default Dashboard;

const Info = ({ label, value }) => (
  <div>
    <p className="text-neutral-500 text-xs">{label}</p>
    <p className="text-white font-medium">{value || "--"}</p>
  </div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-6">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <p className="text-neutral-400 text-sm font-medium">{label}</p>
    </div>
    <p className="text-white text-2xl font-bold">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    "In Transit": "bg-blue-500/10 text-blue-300",
    "Delivered": "bg-green-500/10 text-green-300",
    "Pending": "bg-yellow-500/10 text-yellow-300",
    "Cancelled": "bg-red-500/10 text-red-300",
  };

  return (
    <span className={`px-3 py-1 rounded-full font-medium text-xs ${colors[status] || colors["Pending"]}`}>
      {status}
    </span>
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