import type { Dispatch, SetStateAction } from 'react';

export type HeaderProps = {
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};
