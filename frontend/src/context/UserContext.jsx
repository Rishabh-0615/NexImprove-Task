// ============================================
// FILE: context/UserContext.jsx
// ============================================

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/users";

  axios.defaults.withCredentials = true;

  const registerUser = async (name, email, gstin, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, {
        name,
        email,
        gstin,
        password,
      });
      toast.success(data.message);
      return { success: true, token: data.token };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const verifyOtp = async (token, otp) => {
    try {
      const { data } = await axios.post(`${API_URL}/verifyOtp/${token}`, {
        otp,
      });
      toast.success(data.message);
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || "OTP verification failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const forgetPassword = async (email) => {
    try {
      const { data } = await axios.post(`${API_URL}/forget`, { email });
      toast.success(data.message);
      return { success: true, token: data.token };
    } catch (error) {
      const message = error.response?.data?.message || "Request failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (token, otp, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/reset-password/${token}`, {
        otp,
        password,
      });
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/me`);
      setUser(data);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/logout`);
      setUser(null);
      setIsAuthenticated(false);
      toast.success(data.message);
      return { success: true };
    } catch (error) {
      toast.error("Logout failed");
      return { success: false };
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        registerUser,
        verifyOtp,
        loginUser,
        forgetPassword,
        resetPassword,
        logoutUser,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
