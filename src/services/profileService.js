import api from './api';

const profileService = {
  getProfile: async () => {
    const response = await api.get('/user');
    return response.data;
  },

 
    updateProfile: async (formData) => {
        const response = await api.post('/user/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export default profileService;