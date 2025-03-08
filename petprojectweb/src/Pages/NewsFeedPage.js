import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostsComponent from '../Components/PostsComponent';
import '../Assets/NewsFeedPage.css';

const NewsFeedPage = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('news');

    const handleMenuClick = (menuItem) => {
        setActiveMenu(menuItem);
        // Пример навигации (пока заглушка)
        if (menuItem === 'friends') {
            navigate('/friends');
        }
    };

    return (
        <div className="newsfeed-page">
            <header className="mini-bar">
                <div className="logo">
                    <h2>PicyatDva</h2>
                </div>
                <nav className="menu">
                    <ul>
                        <li
                            className={activeMenu === 'profile' ? 'active' : ''}
                            onClick={() => navigate('/profile')}
                        >
                            Профиль
                        </li>
                        <li
                            className={activeMenu === 'news' ? 'active' : ''}
                            onClick={() => handleMenuClick('news')}
                        >
                            Новости
                        </li>
                        <li
                            className={activeMenu === 'friends' ? 'active' : ''}
                            onClick={() => handleMenuClick('friends')}
                        >
                            Друзья
                        </li>
                        <li
                            className={activeMenu === 'search' ? 'active' : ''}
                            onClick={() => handleMenuClick('search')}
                        >
                            Поиск
                        </li>
                        <li
                            className={activeMenu === 'settings' ? 'active' : ''}
                            onClick={() => handleMenuClick('settings')}
                        >
                            Настройки
                        </li>
                    </ul>
                </nav>
                <div className="search-bar">
                    <input type="text" placeholder="Поиск друзей..." />
                </div>
            </header>

            <main className="content">
                {activeMenu === 'news' && <PostsComponent />}
                {activeMenu === 'friends' && <div>Здесь будет поиск и добавление друзей</div>}
                {activeMenu === 'search' && <div>Поиск...</div>}
                {activeMenu === 'settings' && <div>Настройки пользователя</div>}
            </main>
        </div>
    );
};

export default NewsFeedPage;
