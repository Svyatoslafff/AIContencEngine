import axios from 'axios'; // Assuming you are using axios

const API_BASE_URL = '/'; // Adjust if your backend is on a different URL

export const createRequest = async (prompt: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}openai-requests`, { prompt });
    return response.data;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

export const getRequestsByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}openai-requests/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching requests for user ${userId}:`, error);
    throw error;
  }
};

export const getRequestById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}openai-requests/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching request with ID ${id}:`, error);
    throw error;
  }
};