import React, { useContext } from 'react';
import AuthModal from '../components/Modals/AuthModal';
import { Button, modalClasses } from '@mui/material';
import { ModalsContext } from '../contexts/ModalsContext';

const HomePage = ({}) => {
    const modalsData = useContext(ModalsContext);
    if (!modalsData) return;
    return (
        <>
            <section className="flex justify-center items-center ">
                <div className="flex justify-center items-center flex-col">
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
            </section>
            <AuthModal></AuthModal>
        </>
    );
};

export default HomePage;
