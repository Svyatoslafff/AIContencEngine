import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { useContext, useEffect, useState } from 'react';
import { ModalsContext } from './contexts/ModalsContext';
import HomePage from './pages/HomePage';
import { UserContext } from './contexts/UserContext';
import { refreshUser } from './api/auth';

function App() {
    const user = useContext(UserContext);
    if (!user) return;

    useEffect(() => {
        async function refresh() {
            if (!user) return;
            if (user.token) {
                try {
                    console.log(user.token);
                    const res = await refreshUser(user.token);
                    console.log(res);

                    localStorage.setItem(
                        'accessToken',
                        res.data.data.accessToken
                    );
                    user.setUser({ email: res.data.data.email });
                } catch (err) {
                    // localStorage.setItem('accessToken', '');
                    user.setUser(null);
                }
            }
        }
        refresh();
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Header />}>
                <Route index element={<HomePage />} />
            </Route>
        </Routes>
    );
}

export default App;
