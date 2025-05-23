import { Box, Button, Modal, Typography } from '@mui/material';
import { useContext } from 'react';
import { ModalsContext } from '../../contexts/ModalsContext';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { AiOutlineClose } from 'react-icons/ai';
import { loginUser, registerUser } from '../../api/auth';
import toast from 'react-hot-toast';
import type { ModifiedAxiosError } from '../../types';
import { authValidationSchema } from '../../validation/auth';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import type { ActionFunction } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const initialValues = {
    email: '',
    password: '',
};
export type AuthInitialValues = typeof initialValues;

const AuthModal = () => {
    const modalsData = useContext(ModalsContext);
    const user = useContext(UserContext);
    if (!modalsData) throw new Error('Modal states are missing');
    const { modalType } = modalsData;

    async function handleAuthSubmit(
        values: AuthInitialValues,
        action: FormikHelpers<ActionFunction<AuthInitialValues>>
    ): Promise<void> {
        if (!modalsData) return;
        try {
            if (modalsData.modalType === 'register') {
                await registerUser(values);
                toast.success("You've successfully registered!");
                modalsData?.setModalType('login');
                action.resetForm();
            } else {
                const {
                    data: {
                        data: { accessToken, email },
                    },
                } = await loginUser(values);
                localStorage.setItem('accessToken', accessToken);
                user?.setUser({ email });
                toast.success("You've successfully logged in!");
                modalsData?.setIsAuthModalOpen(false);
            }
        } catch (err) {
            toast.error((err as ModifiedAxiosError).response?.data?.message);
        }
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
            className="flex justify-center items-center"
        >
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: 5,
                    borderRadius: 10,
                    position: 'relative',
                    display: 'flex',
                    // justifyContent: 'center'
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <button
                    className="absolute right-6 top-6 hover:bg-gray-200 transition duration-150 ease-in-out cursor-pointer p-1 rounded-full"
                    onClick={handleClose}
                >
                    <AiOutlineClose />
                </button>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <p className="text-3xl font-bold p-4">
                        {modalType === 'register' ? 'Register' : 'Login'}
                    </p>
                </Typography>
                <Formik
                    validationSchema={toFormikValidationSchema(
                        authValidationSchema
                    )}
                    initialValues={initialValues}
                    onSubmit={handleAuthSubmit}
                >
                    <Form className="flex flex-col items-center gap-8 m-4">
                        <label className="formik-label">
                            <p>Email</p>
                            <Field type="email" name="email" />
                            <ErrorMessage name="email">
                                {err => (
                                    <p className="formik-error-message">
                                        {err}
                                    </p>
                                )}
                            </ErrorMessage>
                        </label>
                        <label className="formik-label">
                            <p>Password</p>
                            <Field type="password" name="password" />
                            <ErrorMessage name="password">
                                {err => (
                                    <p className="formik-error-message">
                                        {err}
                                    </p>
                                )}
                            </ErrorMessage>
                        </label>
                        <Button
                            className="w-full"
                            variant="contained"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Form>
                </Formik>
                {modalsData.modalType === 'login' ? (
                    <p className="text-[14px]">
                        If you don't have account yet,{' '}
                        <button
                            className="text-blue-500 cursor-pointer hover:text-blue-400 transition duration-150"
                            onClick={() => modalsData.setModalType('register')}
                        >
                            register
                        </button>
                    </p>
                ) : (
                    <p className="text-[14px]">
                        If you already have account,{' '}
                        <button
                            className="text-blue-500 cursor-pointer hover:text-blue-400 transition duration-150"
                            onClick={() => modalsData.setModalType('login')}
                        >
                            login
                        </button>
                    </p>
                )}
            </Box>
        </Modal>
    );
};

export default AuthModal;
