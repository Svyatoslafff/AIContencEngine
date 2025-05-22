import type { Dispatch, SetStateAction } from 'react';

export type ModalsStates = {
    // isLoginModalOpen: boolean;
    // setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
    isAuthModalOpen: boolean;
    setIsAuthModalOpen: Dispatch<SetStateAction<boolean>>;
    modalType: 'login' | 'register';
    setModalType: Dispatch<SetStateAction<'login' | 'register'>>;
};
