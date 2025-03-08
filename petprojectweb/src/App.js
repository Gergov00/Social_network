// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import AuthPage from './Pages/AuthPage';
import ProfilePage from './Pages/ProfilePage';
import EditProfilePage from './Pages/EditProfilePage';
import MainPage from './Pages/MainPage';
import NewsFeedPage from './Pages/NewsFeedPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Маршруты, где мини-бар нужен */}
                <Route element={<Layout />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/edit-profile" element={<EditProfilePage />} />
                    <Route path="/" element={<MainPage />} />
                    <Route path="/newsfeed" element={<NewsFeedPage />} />
                </Route>
                {/* Страница авторизации без мини-бара */}
                <Route path="/auth" element={<AuthPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
