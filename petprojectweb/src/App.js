import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './Pages/AuthPage';
import ProfilePage from './Pages/ProfilePage';
import EditProfilePage from './Pages/EditProfilePage';
import MainPage from './Pages/MainPage'; 
import NewsFeedPage from './Pages/NewsFeedPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/newsfeed" element={<NewsFeedPage/> }/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
