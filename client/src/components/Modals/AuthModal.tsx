import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { ModalsContext } from '../../contexts/ModalsContext';
import { Field, Form, Formik } from 'formik';

const initialValues = {
    email: '',
    password: '',
};

const AuthModal = () => {
    const modalsData = useContext(ModalsContext);
    if (!modalsData) throw new Error('Modal states are missing');
    const { modalType } = modalsData;

    function handleSubmit(values) {
        console.log(values);
        if (modalType === 'register') {
            console.log('register');
        } else {
            console.log('login');
        }
        modalsData?.setIsAuthModalOpen(false);
    }
    function handleClose() {
        if (!modalsData) throw new Error('Modal states are missing');
        modalsData.setIsAuthModalOpen(false);
    }
    return (
        <Modal
            open={modalsData.isAuthModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
            // sx={style}
            >
                <Button onClick={handleClose}>Close</Button>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {modalType === 'register' ? 'Register' : 'Login'}
                </Typography>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    <Form>
                        <Field type="email" name="email" />
                        <Field type="password" name="password" />
                        <Button variant="contained" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Formik>
            </Box>
        </Modal>
    );
};

export default AuthModal;
