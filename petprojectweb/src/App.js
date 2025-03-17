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
const SearchPage = lazy(() => import('./Pages/SearchPage'));
const FriendsPage = lazy(() => import('./Pages/FriendsPage'));
const ChatPage = lazy(() => import('./Pages/ChatPage'));
const MessagesPage = lazy(() => import('./Pages/MessagesPage'));

function App() {
    return (
        <UserProvider>
            <PostsProvider>
                <BrowserRouter>
                    <Suspense fallback={<p>Загрузка...</p>}>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/search" element={<SearchPage />} />
                                <Route path="/friends" element={<FriendsPage />} />
                                <Route path="/profile/:userId?" element={<ProfilePage />} />
                                <Route path="/chat/:friendId?" element={<ChatPage />} />
                                <Route path="/edit-profile" element={<EditProfilePage />} />
                                <Route path="/" element={<MainPage />} />
                                <Route path="/newsfeed" element={<NewsFeedPage />} />
                                <Route path="/messages" element={<MessagesPage />} />
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
