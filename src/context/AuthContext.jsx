import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                return { success: true };
            } else {
                return {
                    success: false,
                    message: data.message || 'Login failed',
                };
            }
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Network error',
            };
        }
    };

    const register = async (username, email, password, role) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                return { success: true };
            } else {
                return {
                    success: false,
                    message: data.message || 'Registration failed',
                };
            }
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Network error',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        // Optional: Redirect to login or handle in UI
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
