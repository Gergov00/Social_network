import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import { UserProvider } from './Context/UserContext';
import { PostsProvider } from './Context/PostsContext';

const AuthPage = lazy(() => import('./Pages/AuthPage'));
const ProfilePage = lazy(() => import('./Pages/ProfilePage'));
const EditProfilePage = lazy(() => import('./Pages/EditProfilePage'));
const MainPage = lazy(() => import('./Pages/MainPage'));
const NewsFeedPage = lazy(() => import('./Pages/NewsFeedPage'));

function App() {
    return (
        <UserProvider>
            <PostsProvider>
                <BrowserRouter>
                    <Suspense fallback={<p>Загрузка...</p>}>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/profile/:userId?" element={<ProfilePage />} />
                                <Route path="/edit-profile" element={<EditProfilePage />} />
                                <Route path="/" element={<MainPage />} />
                                <Route path="/newsfeed" element={<NewsFeedPage />} />
                            </Route>
                            <Route path="/auth" element={<AuthPage />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </PostsProvider>
        </UserProvider>
    );
}

export default App;
