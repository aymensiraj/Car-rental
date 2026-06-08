import api from '../services/api.js';

export const carService = {
  
  // 1. جلب جميع السيارات (للـ Store مثلاً)
  getAllCars: async () => {
    try {
      const response = await api.get('/cars');
      return response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des voitures:", error);
      throw error;
    }
  },

  // 2. جلب سيارات الوكالة الحالية فقط
  getAgencyCars: async () => {
    try {
      const response = await api.get('/agency/cars');
      return response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des voitures de l'agence:", error);
      throw error;
    }
  },

  // 🔥 3. الدالة لّي كانت ناقصة ومسببة الـ White Screen والـ Error
  getCar: async (id) => {
    try {
      const response = await api.get(`/cars/${id}`);
      return response.data; // هادي ضرورية باش نعمرو بها الـ Update Form تلقائياً
    } catch (error) {
      console.error(`Erreur lors du chargement de la voiture ${id}:`, error);
      throw error;
    }
  },

  // 4. إضافة سيارة جديدة
  addCar: async (carData) => {
    try {
      const response = await api.post('/cars', carData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la voiture:", error);
      throw error;
    }
  },

  // 5. حذف سيارة
  deleteCar: async (carId) => {
    try {
      const response = await api.delete(`/cars/${carId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de la voiture:", error);
      throw error;
    }
  },

  // 6. تحديث السيارة
  updateCar: async (id, formData) => {
    try {
      // ✅ POST + _method=PUT باش Laravel يقبل multipart/form-data
      const response = await api.post(`/cars/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la voiture:", error);
      throw error;
    }
  }
};