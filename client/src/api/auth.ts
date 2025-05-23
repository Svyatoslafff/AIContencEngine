import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

export function setAuthHeader(token: string) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}
export function clearAuthHeader() {
    axios.defaults.headers.common.Authorization = '';
}

export async function loginUser(payload: { email: string; password: string }) {
    try {
        const data = await axios.post('/auth/login', payload);
        console.log(data);

        return data;
    } catch (err) {
        throw err;
    }
}

export async function registerUser(payload: {
    email: string;
    password: string;
}) {
    try {
        const data = await axios.post('/auth/register', payload);
        console.log(data);

        return data;
    } catch (err) {
        throw err;
    }
}

export async function refreshUser(token: string) {
    try {
        const data = await axios.post(
            '/auth/refresh',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return data;
    } catch (err) {
        throw err;
    }
}
export async function logoutUser(token: string) {
    try {
        const data = await axios.post(
            '/auth/logout',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return data;
    } catch (err) {
        throw err;
    }
}
