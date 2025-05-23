import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { ModalsContext } from '../contexts/ModalsContext';
import { Button } from '@mui/material';
import { UserContext } from '../contexts/UserContext';
import clsx from 'clsx';
import { logoutUser } from '../api/auth';
import toast from 'react-hot-toast';
import type { ModifiedAxiosError } from '../types';

const Header = () => {
    const modalsData = useContext(ModalsContext);
    if (!modalsData) return;
    const user = useContext(UserContext);
    if (!user) return;

    async function handleLogout() {
        if (!user || !user.token) return;

        try {
            await logoutUser(user.token);
            user.setUser(null);
            localStorage.setItem('accessToken', '');
        } catch (err) {
            toast.error((err as ModifiedAxiosError).response?.data?.message);
        }
    }

    return (
        <>
            <header
                className={`flex items-center h-15 w-full bg-gray-200 pr-6 pl-6 absolute  inset-0 ${clsx(!user.user ? 'justify-end' : 'justify-between')}`}
            >
                <a
                    href="/"
                    className="font-bold text-2xl absolute text-black h-max w-max inset-1/2 -translate-1/2"
                >
                    AI Engine
                </a>
                {!user.user ? (
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
                    <>
                        <div>Hello, {user.user.email}</div>
                        <Button variant="outlined" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                )}
            </header>
            <main className="h-[100vh] pt-15">
                <Outlet />
            </main>
        </>
    );
};

export default Header;
