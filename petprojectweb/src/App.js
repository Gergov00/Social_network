import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './Pages/AuthPage';
import ProfilePage from './Pages/ProfilePage';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {/* ѕеренаправл€ем корень на страницу авторизации */}
                <Route path="/" element={<Navigate to="/auth" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
