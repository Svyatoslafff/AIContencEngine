import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { useContext, useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import { UserContext } from './contexts/UserContext';
import RequestPage from './pages/RequestPage';
import { refreshUser } from './api/auth';

function App() {
    const user = useContext(UserContext);
    const [isRefreshing, setIsRefreshing] = useState(true);
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
                } finally {
                    setIsRefreshing(false);
                }
            }
        }
        refresh();
    }, []);
    if (!isRefreshing)
        return (
            <Routes>
                <Route path="/" element={<Header />}>
                    <Route index element={<HomePage />} />
                    <Route path="/requests/:id" element={<RequestPage />} />
                </Route>
            </Routes>
        );
}

export default App;
