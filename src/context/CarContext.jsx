import { createContext, useContext, useState } from 'react';
import API from '../services/api';

const CarContext = createContext();

export function CarProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [userCars, setUserCars] = useState([]);
  const [singleCar, setSingleCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all cars
  const getAllCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/cars/all-cars');
      setCars(data.cars || data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch cars.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user's cars
  const getUserCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/cars/my-cars');
      setUserCars(data.cars || data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch your cars.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single car by ID
  const getSingleCar = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/cars/single-car/${id}`);
      setSingleCar(data.car || data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch car details.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add new car
  const addCar = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/cars/add-car', formData);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to post listing. Please check all fields.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete car
  const deleteCar = async (carId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.delete(`/cars/delete-car/${carId}`);
      // Update userCars and cars by removing deleted car
      setUserCars(userCars.filter(car => car._id !== carId));
      setCars(cars.filter(car => car._id !== carId));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete car.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark car as sold
  const markAsSold = async (carId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.put(`/cars/mark-as-sold/${carId}`);
      // Update userCars by finding and updating the car
      setUserCars(userCars.map(car => 
        car._id === carId ? { ...car, status: 'sold' } : car
      ));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to mark car as sold.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update car (Admin)
  const updateCar = async (carId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.put(`/cars/update-car/${carId}`, updateData);
      const updatedCar = data.car || data;
      // Update cars and userCars
      setCars(cars.map(car => car._id === carId ? updatedCar : car));
      setUserCars(userCars.map(car => car._id === carId ? updatedCar : car));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update car.';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cars,
    userCars,
    singleCar,
    loading,
    error,
    getAllCars,
    getUserCars,
    getSingleCar,
    addCar,
    deleteCar,
    markAsSold,
    updateCar,
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
}

export function useCar() {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCar must be used within a CarProvider');
  }
  return context;
}
