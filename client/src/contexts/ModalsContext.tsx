import React, { useState } from 'react';
import type { ModalsStates } from '../types/modals';

interface ModalsContextProps {
    children: React.ReactNode;
}

export const ModalsContext = React.createContext<ModalsStates | null>(null);

const ModalsProvider: React.FC<ModalsContextProps> = ({ children }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'login' | 'register'>('login');
    // const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const value = {
        isAuthModalOpen,
        setIsAuthModalOpen,
        modalType,
        setModalType,
    };
    return (
        <ModalsContext.Provider value={value}>
            {children}
        </ModalsContext.Provider>
    );
};
export default ModalsProvider;
