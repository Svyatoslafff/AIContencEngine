import type { Dispatch, SetStateAction } from 'react';

export type HeaderProps = {
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
    isLoginModalOpen: boolean;
    isRegisterModalOpen: boolean;
    setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
    setIsRegisterModalOpen: Dispatch<SetStateAction<boolean>>;
};
