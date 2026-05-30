import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import type { User } from '@entities/user/types/user';

type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isInitialized: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
};

const authContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Загрузка пользователя из localStorage при старте
    useEffect(() => {
        const loadUserFromStorage = () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                console.log('Loading from storage:', { token: !!token, storedUser: !!storedUser });

                if (token && storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Failed to load user from storage:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setIsInitialized(true);
            }
        };

        loadUserFromStorage();
    }, []);

    const login = (userData: User, token: string) => {
        console.log('Login called:', { userData, tokenType: typeof token });

        // Сохраняем токен (убеждаемся, что это строка)
        const tokenString = typeof token === 'string' ? token : JSON.stringify(token);
        localStorage.setItem('token', tokenString);

        // Сохраняем пользователя
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');  // очищаем лишние
        localStorage.removeItem('refreshToken'); // очищаем лишние
        setUser(null);
    };

    return (
        <authContext.Provider value={{ user, setUser, isInitialized, login, logout }}>
            {children}
        </authContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(authContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};