import api from '../services/api.js';

export const carService = {
  getAllCars: async () => {
    try {
      const response = await api.get('/cars');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAgencyCars: async () => {
    try {
      const response = await api.get('/agency/cars');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCar: async (id) => {
    try {
      const response = await api.get(`/cars/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addCar: async (carData) => {
    try {
      const response = await api.post('/cars', carData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCar: async (carId) => {
    try {
      const response = await api.delete(`/cars/${carId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCar: async (id, formData) => {
    try {
      const response = await api.post(`/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};