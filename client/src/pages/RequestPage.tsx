import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext'; // Assuming UserContext provides the user and token
import { getRequestsByUserId } from '../api/openai'; // Assuming this function exists

interface Request {
    _id: string; // Use _id to match your backend schema
    prompt: string;
    response: string;
}

const RequestPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [request, setRequest] = useState<Request | null>(null);
    const [previousRequests, setPreviousRequests] = useState<Request[]>([]);
    const user = useContext(UserContext);

    useEffect(() => {
        const fetchRequest = async () => {
            if (!id || !user.user || !user.user.token) return;

            try {
                const token = user.user.token;
                const response = await fetch(`/openai-requests/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch request');
                }

                const requestData: Request = await response.json();
                setRequest(requestData);
            } catch (error) {
                console.error('Error fetching request:', error);
                setRequest(null); // Set request to null on error
            }
        };

        fetchRequest();
    }, [id, user.user]); // Re-fetch request when id or user changes

    useEffect(() => {
        const fetchPreviousRequests = async () => {
            if (!user.user || !user.user.token || !user.user._id) return;

            try {
                // Assuming getRequestsByUserId is implemented to call your backend
                const response = await getRequestsByUserId(user.user._id); // Assuming _id is the user ID
                setPreviousRequests(response.data);
            } catch (error) {
                console.error('Error fetching previous requests:', error);
            }
        };

        fetchPreviousRequests();
    }, [user.user]); // Re-fetch previous requests when user changes

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Previous Requests</h2>
                <ul>
                    {previousRequests.map((prevRequest) => (
                        <li key={prevRequest._id} className="mb-2">
                            <Link
                                to={`/requests/${prevRequest._id}`}
                                className={`text-blue-600 hover:underline ${
                                    id === prevRequest._id ? 'font-bold' : ''
                                }`}
                            >
                                {prevRequest.prompt.substring(0, 50)}... {/* Display a snippet of the prompt */}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 overflow-y-auto">
                {request ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Request Details</h2>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Prompt:</h3>
                            <p>{request.prompt}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Response:</h3>
                            <p>{request.response}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading request or request not found...</p>
                )}
            </div>
        </div>
    );
};

export default RequestPage;
