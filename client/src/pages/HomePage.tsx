import { useContext, useState, useEffect } from 'react';
import AuthModal from '../components/Modals/AuthModal';
import { Button } from '@mui/material';
import { ModalsContext } from '../contexts/ModalsContext';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { createRequest, getRequestsByUserId } from '../api/openai'; // Assuming createRequest is defined here

const HomePage = () => { // Corrected component definition
    const modalsData = useContext(ModalsContext);
    const user = useContext(UserContext);

    const [requests, setRequests] = useState([]);
    const [newRequestText, setNewRequestText] = useState('');
    const navigate = useNavigate();

    const fetchRequests = async () => {
        if (!user.user) return;
        try {
            // Assuming getRequestsByUserId is implemented to call your backend
            const response = await getRequestsByUserId(user.user._id); // Assuming _id is the user ID
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const handleInputChange = (event) => {
        setNewRequestText(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (newRequestText.trim() === '') {
            return;
        }

        try {
            // Get the authentication token from your user context or wherever you store it
            const token = user.user.token; // Assuming the token is stored in user.user.token

            const response = await fetch('/openai-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the JWT token
                },
                body: JSON.stringify({ prompt: newRequestText }),
            });

            if (!response.ok) {
                throw new Error('Failed to create request');
            }

            const newRequest = await response.json();

            setNewRequestText('');
            if (newRequest && newRequest._id) {
                navigate(`/requests/${newRequest._id}`); // Redirect to the new request page using the returned ID
            }
            fetchRequests(); // Refresh the list after creating
        } catch (error) {
            console.error('Error creating request:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user.user]); // Add user.user to the dependency array

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
                        <form onSubmit={handleFormSubmit} className="mb-4">
                            <input
                                type="text"
                                value={newRequestText}
                                onChange={handleInputChange}
                                placeholder="Enter your request..."
                                className="border p-2 rounded w-full"
                            />
                            <Button type="submit" variant="contained" className="mt-2">
                                Create Request
                            </Button>
                        </form>
                        <ul>
                            {requests.map((request) => (
                                // Assuming each request object has an _id and a prompt field
                                <li key={request._id}>{request.prompt}</li>
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
