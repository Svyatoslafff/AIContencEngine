import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import ModalsProvider from './contexts/ModalsContext.tsx';
import { Toaster } from 'react-hot-toast';
import UserProvider from './contexts/UserContext.tsx';

createRoot(document.getElementById('root')!).render(
    <UserProvider>
        <ModalsProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
            <Toaster />
        </ModalsProvider>
    </UserProvider>
);
