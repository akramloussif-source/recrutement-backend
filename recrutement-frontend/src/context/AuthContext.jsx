import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        return token ? { token, role, userId } : null;
    });

    const navigate = useNavigate();

    const login = async (loginData) => {
        const res = await api.post('/auth/login', loginData);
        const { token, role, userId, nom } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);
        localStorage.setItem('nom', nom);
        setUser({ token, role, userId, nom });
        if (role === 'CANDIDAT') navigate('/candidat/dashboard');
        else navigate('/recruteur/dashboard');
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);