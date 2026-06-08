import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { carService } from '../services/carService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const [cart, setCart] = useState(() => {
    const savedCart = Cookies.get('autodrive_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    Cookies.set('autodrive_cart', JSON.stringify(cart), { expires: 7, secure: true, sameSite: 'strict' });
  }, [cart]);

  
  useEffect(() => {
const fetchCars = async () => {
  setLoading(true);
  try {
    const data = await carService.getAllCars();

    const normalizeCarImage = (car) => ({
      ...car,
      image_url: car.image_url ||
        (car.image ? `http://localhost:8000/storage/${car.image}` : '/placeholder-car.jpg')
    });

    if (Array.isArray(data)) {
      setCars(data.map(normalizeCarImage));
    } else if (data && Array.isArray(data.cars)) {
      setCars(data.cars.map(normalizeCarImage));
    } else if (data && Array.isArray(data.data)) {
      setCars(data.data.map(normalizeCarImage));
    }
  } catch (error) {
    console.error("Impossible de récupérer les voitures:", error);
  } finally {
    setLoading(false);
  }
};

    fetchCars();
  }, []); 


  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.car.id === item.car.id);
      if (exists) return prev.map(i => i.car.id === item.car.id ? item : i);
      return [...prev, item];
    });
  };

  const removeFromCart = (carId) => {
    setCart(prev => prev.filter(i => i.car.id !== carId));
  };

  const clearCart = () => {
    setCart([]);
    Cookies.remove('autodrive_cart', { path: '/' });
  };

  return (
    <AppContext.Provider value={{
      cars,
      loading,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      setCart 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};