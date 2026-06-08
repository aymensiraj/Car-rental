import api from './api';

const adminService = {

  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      return response.data;
    } catch (error) {
      console.error("Erreur adminService (getDashboardStats):", error);
      throw error;
    }
  },

  getAgencies: async () => {
      const response = await api.get('/admin/agencies');
      return {
          active:  response.data.agencies || [],
          pending: response.data.pending  || [],
      };
  },

  approveAgency: async (id) => {
    const response = await api.put(`/admin/agencies/${id}/approve`);
    return response.data;
  },

  rejectAgency: async (id) => {
      const response = await api.delete(`/admin/agencies/${id}/reject`);
      return response.data;
  },

  // ✅ زيد هاد الدالة
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data.users || response.data;
    } catch (error) {
      console.error("Erreur adminService (getUsers):", error);
      throw error;
    }
  },

  getCarsFleet: async () => {
    try {
      const response = await api.get('/cars');
      return response.data.cars || response.data;
    } catch (error) {
      console.error("Erreur adminService (getCarsFleet):", error);
      throw error;
    }
  },

  deleteCar: async (id) => {
    try {
      const response = await api.delete(`/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur adminService (deleteCar ${id}):`, error);
      throw error;
    }
  },

  // ✅ زيد هاد الدالة
  deleteAccount: async (id) => {
    try {
      const response = await api.delete(`/admin/accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur adminService (deleteAccount ${id}):`, error);
      throw error;
    }
  }
};

export default adminService;