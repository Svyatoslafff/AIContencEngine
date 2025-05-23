import { useContext } from 'react';
import AuthModal from '../components/Modals/AuthModal';
import { Button, dividerClasses } from '@mui/material';
import { ModalsContext } from '../contexts/ModalsContext';
import { UserContext } from '../contexts/UserContext';

const HomePage = ({}) => {
    const modalsData = useContext(ModalsContext);
    const user = useContext(UserContext);

    if (!modalsData || !user) return;
    return (
        <>
            <section className="flex justify-center items-center p-10 flex-1 relative">
                {!user.user ? (
                    <div className="flex h-full justify-center items-center  flex-col flex-1 gap-4">
                        <h1 className="text-3xl">Sign in to continue</h1>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                modalsData.setModalType('login');
                                modalsData.setIsAuthModalOpen(true);
                            }}
                        >
                            Signin
                        </Button>
                    </div>
                ) : (
                    <div className="w-[50vw] p-10 rounded-2xl h-full shadow-2xl"></div>
                )}
            </section>
            <AuthModal></AuthModal>
        </>
    );
};

export default HomePage;
