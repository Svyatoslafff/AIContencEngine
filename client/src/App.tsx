import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { useContext, useState } from 'react';
import { ModalsContext } from './contexts/ModalsContext';
import HomePage from './pages/HomePage';

function App() {
    // const modalStates = useContext(ModalsContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    // const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Header
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        // isLoginModalOpen={isLoginModalOpen}
                        // isRegisterModalOpen={isRegisterModalOpen}
                        // setIsLoginModalOpen={setIsLoginModalOpen}
                        // setIsRegisterModalOpen={setIsRegisterModalOpen}
                    />
                }
            >
                <Route index element={<HomePage />} />
            </Route>
        </Routes>
    );
}

export default App;
