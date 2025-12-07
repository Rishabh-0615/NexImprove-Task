import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/admin";

  axios.defaults.withCredentials = true;

  const loginAdmin = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/admin-login`, {
        email,
        password,
      });
      setAdmin(data.admin);
      setIsAuthenticated(true);
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/me`);
      setAdmin(data);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      setAdmin(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const getUnverifiedUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/unverified-users`);
      return { success: true, users: data.users };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch users";
      toast.error(message);
      return { success: false, message };
    }
  };

  const approveUser = async (userId) => {
    try {
      const { data } = await axios.put(`${API_URL}/verify-user/${userId}`);
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to approve user";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logoutAdmin = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/logout`);
      setAdmin(null);
      setIsAuthenticated(false);
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      toast.error("Logout failed");
      return { success: false };
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAuthenticated,
        loading,
        loginAdmin,
        getUnverifiedUsers,
        approveUser,
        logoutAdmin,
        fetchAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};