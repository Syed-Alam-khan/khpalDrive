import { createContext, useContext, useState } from 'react';
import API from '../services/api';

const AutoPartContext = createContext();

export const useAutoPart = () => {
  return useContext(AutoPartContext);
};

export const AutoPartProvider = ({ children }) => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllParts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/autoparts');
      setParts(data.parts);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error('Error fetching parts:', error);
      throw error;
    }
  };

  const getPartById = async (id) => {
    try {
      const { data } = await API.get(`/autoparts/${id}`);
      return data.part;
    } catch (error) {
      console.error('Error fetching part details:', error);
      throw error;
    }
  };

  const addPart = async (formData) => {
    try {
      setLoading(true);
      const { data } = await API.post('/autoparts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error('Error adding part:', error);
      throw error;
    }
  };

  const deletePart = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/autoparts/${id}`);
      setParts(parts.filter((p) => p._id !== id));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error deleting part:', error);
      throw error;
    }
  };

  const updatePartStatus = async (id, status) => {
    try {
      setLoading(true);
      const { data } = await API.put(`/autoparts/${id}/status`, { status });
      setParts(parts.map((p) => (p._id === id ? data.part : p)));
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error('Error updating part status:', error);
      throw error;
    }
  };

  return (
    <AutoPartContext.Provider
      value={{
        parts,
        loading,
        getAllParts,
        getPartById,
        addPart,
        deletePart,
        updatePartStatus,
      }}
    >
      {children}
    </AutoPartContext.Provider>
  );
};
