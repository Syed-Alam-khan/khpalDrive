import { createContext, useContext, useState } from 'react';
import API from '../services/api';

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all categories
  const getAllCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/categories/all-categories');
      const categoryData = data.categories || data;
      setCategories(categoryData);
      return categoryData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch categories.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add new category (Admin)
  const addCategory = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/categories/add-category', { name });
      // Add new category to state
      setCategories([...categories, data.category || { _id: data._id, name }]);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add category.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update category (Admin)
  const updateCategory = async (id, name) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.put(`/categories/update-category/${id}`, { name });
      setCategories(categories.map(cat => cat._id === id ? { ...cat, name } : cat));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update category.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete category (Admin)
  const deleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.delete(`/categories/delete-category/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete category.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // User adds a category (when selecting 'Other')
  const userAddCategory = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/categories/user-add-category', { name });
      const newCat = data.category;
      setCategories(prev => {
        if (!prev.find(c => c._id === newCat._id)) {
          return [...prev, newCat];
        }
        return prev;
      });
      return newCat;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add category.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    categories,
    loading,
    error,
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    userAddCategory,
  };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}
