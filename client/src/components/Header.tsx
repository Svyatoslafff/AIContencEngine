import { Outlet } from 'react-router-dom';
import type { HeaderProps } from '../types/props';
import { useContext } from 'react';
import { ModalsContext } from '../contexts/ModalsContext';
import { Button } from '@mui/material';

const Header = ({ isLoggedIn, setIsLoggedIn }: HeaderProps) => {
    const modalsData = useContext(ModalsContext);
    if (!modalsData) throw new Error('Modal states are missing');
    console.log(modalsData);

    return (
        <>
            <header className="flex justify-end items-center h-15 w-full bg-gray-200 pr-6 relative">
                <a
                    href="/"
                    className="text-2xl absolute text-black h-max w-max inset-1/2 -translate-1/2"
                >
                    AI Engine
                </a>
                {!isLoggedIn ? (
                    <nav className="flex gap-2">
                        <Button
                            variant="outlined"
                            onClick={() => {
                                modalsData.setModalType('login');
                                modalsData.setIsAuthModalOpen(true);
                            }}
                        >
                            Signin
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                modalsData.setModalType('register');
                                modalsData.setIsAuthModalOpen(true);
                            }}
                        >
                            Signup
                        </Button>
                    </nav>
                ) : (
                    <div></div>
                )}
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Header;
