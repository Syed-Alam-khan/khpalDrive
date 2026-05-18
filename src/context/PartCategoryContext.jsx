import { createContext, useContext, useState } from 'react';
import API from '../services/api';

const PartCategoryContext = createContext();

export const usePartCategory = () => useContext(PartCategoryContext);

export const PartCategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllCategories = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/part-categories/all-categories');
      setCategories(data.categories || []);
      setLoading(false);
      return data.categories;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const addCategory = async (name) => {
    try {
      setLoading(true);
      const { data } = await API.post('/part-categories/add-category', { name });
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const updateCategory = async (id, name) => {
    try {
      setLoading(true);
      const { data } = await API.put(`/part-categories/update-category/${id}`, { name });
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      const { data } = await API.delete(`/part-categories/delete-category/${id}`);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return (
    <PartCategoryContext.Provider
      value={{
        categories,
        loading,
        getAllCategories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </PartCategoryContext.Provider>
  );
};
