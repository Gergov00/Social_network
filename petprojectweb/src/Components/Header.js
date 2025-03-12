import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/Header.css';
import { getFriendRequests, acceptFriendRequest } from '../Services/Api';
import { useUser } from '../Context/UserContext';

const Header = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [activeMenu, setActiveMenu] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);

    const handleMenuClick = (menuItem) => {
        setActiveMenu(menuItem);
        if (menuItem === 'friends') {
            navigate('/friends');
        }
        if (menuItem === 'profile') {
            navigate('/profile');
        }
        if (menuItem === 'news') {
            navigate('/newsfeed');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        // Получаем запросы в друзья для текущего пользователя
        async function fetchFriendRequests() {
            try {
                const requests = await getFriendRequests(user.id);
                setFriendRequests(requests);
            } catch (error) {
                console.error(error);
            }
        }
        if (user) {
            fetchFriendRequests();
        }
    }, [user]);

    const handleAcceptRequest = async (requestId) => {
        try {
            await acceptFriendRequest(requestId);
            // Удаляем принятый запрос из списка
            setFriendRequests(friendRequests.filter(req => req.id !== requestId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <header className="mini-bar">
            <div className="logo">
                <h2>PicyatDva</h2>
            </div>
            <nav className="menu">
                <ul>
                    <li className={activeMenu === 'profile' ? 'active' : ''} onClick={() => handleMenuClick('profile')}>Профиль</li>
                    <li className={activeMenu === 'news' ? 'active' : ''} onClick={() => handleMenuClick('news')}>Новости</li>
                    <li className={activeMenu === 'friends' ? 'active' : ''} onClick={() => handleMenuClick('friends')}>Друзья</li>
                    <li className={activeMenu === 'messege' ? 'active' : ''} onClick={() => handleMenuClick('messege')}>Сообщение</li>
                </ul>
            </nav>
            <div className="search-bar">
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Поиск друзей..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Найти</button>
                </form>
            </div>
            <div className="notifications-container">
                <button className="notifications-button" onClick={toggleNotifications}>
                    🔔
                    {friendRequests.length > 0 && (
                        <span className="notification-count">{friendRequests.length}</span>
                    )}
                </button>
                {showNotifications && (
                    <div className="notifications-dropdown">
                        {friendRequests.length === 0 ? (
                            <p>Нет новых запросов</p>
                        ) : (
                            friendRequests.map(req => (
                                <div key={req.id} className="notification-item">
                                    <p>{req.senderFirstName} {req.senderLastName} хочет добавить вас в друзья</p>
                                    <button onClick={() => handleAcceptRequest(req.id)}>Принять</button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
