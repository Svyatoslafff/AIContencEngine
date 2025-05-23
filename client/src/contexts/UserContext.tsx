import React, { useState, type Dispatch, type SetStateAction } from 'react';
import type { ModalsStates } from '../types/modals';

interface UserContextProps {
    children: React.ReactNode;
}

type User = { email: string } | null;

export const UserContext = React.createContext<{
    token: string | null;
    user: User;
    setToken: Dispatch<SetStateAction<string>>;
    setUser: Dispatch<SetStateAction<User>>;
} | null>(null);

const UserProvider: React.FC<UserContextProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => {
        const token = localStorage.getItem('accessToken');
        if (token) return token;
        return null;
    });
    const [user, setUser] = useState<User>(null);

    const value = {
        token,
        user,
        setToken,
        setUser,
    };
    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};
export default UserProvider;
