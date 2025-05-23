import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { getRequestsByUserId } from '../api/openai';
import { getRequestById } from '../api/openai';
interface Request {
    _id: string;
    prompt: string;
    response: string;
}

const RequestPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [request, setRequest] = useState<Request | null>({
        _id: id,
        prompt: 'fdsfsdfdsf',
        response: 'fsdfsdfsdfds',
    });
    const [previousRequests, setPreviousRequests] = useState<Request[]>([
        { _id: '14324234234', prompt: 'dsfdsfsf', response: 'fdsgdfgdfgdfgfd' },
        {
            _id: '14324234232234',
            prompt: 'reterter',
            response: 'fgfdgfdgjnsfkdsnfk',
        },
        { _id: '1435234234', prompt: 'dsfdsfsf', response: 'rfgndfgidfogid' },
        {
            _id: '143345234234',
            prompt: 'tertert',
            response: 'fdgjdfngkndfgkjnfd',
        },
    ]);
    const user = useContext(UserContext);

    useEffect(() => {
        const fetchRequest = async () => {
            if (!id || !user || !user.user || !user.token) return;

            try {
                //! uncomment this to fetch request
                // const response = await getRequestById(id);
                // const requestData: Request = await response.json();
                setRequest(requestData);
            } catch (error) {
                console.error('Error fetching request:', error);
                // setRequest(null);
            }
        };

        fetchRequest();
    }, [id, user.user]);

    useEffect(() => {
        const fetchPreviousRequests = async () => {
            if (!user || !user.user || !user.token || !user.user._id) return;

            try {
                const response = await getRequestsByUserId(user.user._id);
                setPreviousRequests(response.data);
            } catch (error) {
                console.error('Error fetching previous requests:', error);
            }
        };

        fetchPreviousRequests();
    }, [user.user]);

    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Previous Requests</h2>
                <ul>
                    {previousRequests.map(prevRequest => (
                        <li key={prevRequest._id} className="mb-2">
                            <Link
                                to={`/requests/${prevRequest._id}`}
                                className={`text-blue-600 hover:underline ${
                                    id === prevRequest._id ? 'font-bold' : ''
                                }`}
                            >
                                {prevRequest.prompt.substring(0, 50)}...{' '}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {request ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            Request Details
                        </h2>
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
