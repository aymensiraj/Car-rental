import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
let isLoggedOut = false;

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (isLoggedOut) { setLoading(false); return; }
            try {
                const response = await api.get('/user');
                if (response.data?.user) {
                    setCurrentUser(response.data.user);
                    setCurrentRole(response.data.role || response.data.user.role);
                }
            } catch {
                setCurrentUser(null);
                setCurrentRole(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        isLoggedOut = false;
        try {
            await api.get('http://localhost:8000/sanctum/csrf-cookie');
            const response = await api.post('/login', { email, password });
            if (response.data?.user) {
                const userVal = response.data.user;
                const roleVal = response.data.role || userVal.role;
                setCurrentUser(userVal);
                setCurrentRole(roleVal);
                return { success: true, role: roleVal };
            }
            return { success: false, message: "Données de réponse invalides" };
        } catch (error) {
            // ✅ pending agency
            if (error.response?.status === 403 && error.response?.data?.message === 'pending') {
                return { success: false, pending: true };
            }
            const msg = error.response?.data?.message || "Email ou mot de passe incorrect";
            return { success: false, message: msg };
        }
    };

    const register = async (name, email, password, password_confirmation) => {
        try {
            await api.get('http://localhost:8000/sanctum/csrf-cookie');
            const response = await api.post('/register', { name, email, password, password_confirmation });
            if (response.data?.success) {
                const { user } = response.data;
                setCurrentUser(user);
                setCurrentRole(user.role || 'user');
                return { success: true };
            }
            return { success: false, message: "Erreur lors de l'inscription" };
        } catch (error) {
            const errorData = error.response?.data;
            const message = errorData?.errors
                ? Object.values(errorData.errors).flat()[0]
                : (errorData?.message || "Erreur lors de l'inscription");
            return { success: false, message };
        }
    };

    // ✅ registerAgency — بلا cookies ولا token
    const registerAgency = async (name, email, password, password_confirmation) => {
        try {
            await api.get('http://localhost:8000/sanctum/csrf-cookie');
            const response = await api.post('/register-agency', { name, email, password, password_confirmation });
            if (response.data?.success) {
                return { success: true, pending: true };
            }
            return { success: false, message: "Erreur lors de l'inscription" };
        } catch (error) {
            const errorData = error.response?.data;
            const message = errorData?.errors
                ? Object.values(errorData.errors).flat()[0]
                : (errorData?.message || "Erreur lors de l'inscription");
            return { success: false, message };
        }
    };

    const logout = async () => {
        isLoggedOut = true;
        setCurrentUser(null);
        setCurrentRole(null);
        api.post('/logout').catch(() => {});
    };

    return (
        <AuthContext.Provider value={{ currentUser, currentRole, login, register, registerAgency, logout, setCurrentUser, setCurrentRole }}>
            {!loading
                ? children
                : <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center text-xs font-black uppercase text-orange-600 tracking-widest animate-pulse">Chargement...</div>
            }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);