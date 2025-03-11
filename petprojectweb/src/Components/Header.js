import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

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
        </header>
    );
};

export default Header;
