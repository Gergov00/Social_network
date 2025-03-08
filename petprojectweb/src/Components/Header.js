// Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/NewsFeedPage.css'; // или подключите нужные стили

const Header = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('');

    const handleMenuClick = (menuItem) => {
        setActiveMenu(menuItem);
        if (menuItem === 'friends') {
            navigate('/friends');
        }
        if (menuItem === 'profile') {
            navigate('profile');
        }
        if (menuItem === 'news') {
            navigate('/newsfeed')
        }
        // Добавьте дополнительную навигацию для других пунктов, если необходимо
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
                    <li className={activeMenu === 'search' ? 'active' : ''} onClick={() => handleMenuClick('search')}>Поиск</li>
                    <li className={activeMenu === 'settings' ? 'active' : ''} onClick={() => handleMenuClick('settings')}>Настройки</li>
                </ul>
            </nav>
            <div className="search-bar">
                <input type="text" placeholder="Поиск друзей..." />
            </div>
        </header>
    );
};

export default Header;
