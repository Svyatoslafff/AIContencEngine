import axios from 'axios'; // Assuming you are using axios

const API_BASE_URL = '/'; // Adjust if your backend is on a different URL

export const createRequest = async (prompt: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_BASE_URL}openai-requests`, { prompt }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating request:', error);
 if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Handle unauthorized error, e.g., redirect to login
 console.error('Unauthorized. Please log in.');
 }
    throw error;
  }
};

export const getRequestsByUserId = async (userId: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}openai-requests/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching requests for user ${userId}:`, error);
 if (axios.isAxiosError(error) && error.response?.status === 401) {
 console.error('Unauthorized. Please log in.');
 }
    throw error;
  }
};

export const getRequestById = async (id: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}openai-requests/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching request with ID ${id}:`, error);
 if (axios.isAxiosError(error) && error.response?.status === 401) {
 console.error('Unauthorized. Please log in.');
 }
    throw error;
  }
};