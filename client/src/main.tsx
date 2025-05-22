import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import ModalsProvider from './contexts/ModalsContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ModalsProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ModalsProvider>
    </StrictMode>
);
