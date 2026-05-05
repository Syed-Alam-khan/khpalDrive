import { createContext, useContext, useState } from 'react';
import API from '../services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
      try {
        const parsed = JSON.parse(storedInfo);
        return parsed.user || parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/users/login', { email, password });
      // Ensure token is explicitly included in the stored data
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/users/register', formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await API.post('/users/logout');
      localStorage.removeItem('userInfo');
      setUser(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Logout failed.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user profile
  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/users/profile');
      setUser(data.user || data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch profile.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.put('/users/profile', profileData);
      const updatedUser = data.user || data;
      setUser(updatedUser);
      
      // Update localStorage with new user info
      const storedInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const updatedInfo = { ...storedInfo, user: updatedUser };
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all users (Admin)
  const getAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/users');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch users.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete user (Admin)
  const deleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.delete(`/users/${userId}`);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user (Admin)
  const updateUser = async (userId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.put(`/users/${userId}`, updateData);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update user.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    getAllUsers,
    deleteUser,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
