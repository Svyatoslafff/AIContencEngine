import { useContext, useState, useEffect } from 'react';
import AuthModal from '../components/Modals/AuthModal';
import { Button } from '@mui/material';
import { ModalsContext } from '../contexts/ModalsContext';
import { UserContext } from '../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { createRequest, getRequestsByUserId } from '../api/openai';
import toast from 'react-hot-toast';
import type { ModifiedAxiosError } from '../types';

const HomePage = () => {
    const modalsData = useContext(ModalsContext);
    const user = useContext(UserContext);
    if (!user || !modalsData) return;
    const [requests, setRequests] = useState([
        { _id: 14324234234, prompt: 'fdsfsdfdsf' },
        { _id: 14324234232234, prompt: 'dsfdsfsf' },
        { _id: 1435234234, prompt: 'reterter' },
        { _id: 143345234234, prompt: 'tertert' },
    ]);
    const [newRequestText, setNewRequestText] = useState('');
    const navigate = useNavigate();

    const fetchRequests = async () => {
        if (!user || !user.user) return;
        try {
            const response = await getRequestsByUserId(user.user._id);
            console.log(response);

            //! setRequests(response);  uncomment this to fetch requests
        } catch (err) {
            toast.error((err as ModifiedAxiosError).message);
        }
    };

    const handleInputChange = event => {
        setNewRequestText(event.target.value);
    };

    const handleFormSubmit = async event => {
        event.preventDefault();

        if (newRequestText.trim() === '') {
            return;
        }

        if (!user) return;
        try {
            const token = user.token;

            const response = await createRequest(newRequestText);

            if (!response.ok) {
                throw new Error('Failed to create request');
            }

            const newRequest = await response.json();

            setNewRequestText('');
            if (newRequest && newRequest._id) {
                navigate(`/requests/${newRequest._id}`);
            }
            fetchRequests();
        } catch (error) {
            console.error('Error creating request:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user.user]);

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
                    <div className="w-[50vw] p-10 rounded-2xl h-full shadow-2xl">
                        <form
                            onSubmit={handleFormSubmit}
                            className="mb-4 flex flex-col gap-3"
                        >
                            <input
                                type="text"
                                value={newRequestText}
                                onChange={handleInputChange}
                                placeholder="Enter your request..."
                                className="border p-2 rounded w-full"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                className="mt-2 w-full"
                            >
                                Create Request
                            </Button>
                        </form>
                        <ul className="flex flex-col gap-4">
                            {requests.map(request => (
                                <li
                                    key={request._id}
                                    className=" p-2 pl-4 list-disc"
                                >
                                    <Link to={`/requests/${request._id}`}>
                                        {request.prompt}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
            <AuthModal></AuthModal>
        </>
    );
};

export default HomePage;
