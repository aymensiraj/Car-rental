import api from '../services/api'; 

export const orderService = {
  // صيفط الطلب لـ Laravel
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // جيب الطلبات (ديال الـ User الحالي أو الوكالة على حساب الـ Role)
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // 🏢 قبول الطلب (خاص بالوكالة)
  acceptOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/accept`);
    return response.data;
  },

  // 🏢 رفض الطلب (خاص بالوكالة)
  refuseOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/refuse`);
    return response.data;
  },

  handleDownloadPdf : async (orderId) => {
      try {
          const response = await api.get(`/orders/${orderId}/pdf`, {
              responseType: 'blob',
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `reservation-${orderId}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
      } catch (error) {
          console.error("Erreur téléchargement PDF:", error);
      }
  }
};
// 📊 جلب إحصائيات لوحة التحكم الخاصة بالوكالة
export const getAgencyDashboardStats = async () => {
    const response = await api.get('/agency/dashboard-stats');
    return response.data;
};
