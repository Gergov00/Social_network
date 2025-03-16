import React from 'react';
import '../Assets/ProfilePage.css';

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
    return (
        <div className="sidebar">
            <ul className="menu">
                <li onClick={() => setActiveTab('about')} className={activeTab === 'about' ? 'active' : ''}>
                    О себе
                </li>
                <li onClick={() => setActiveTab('photos')} className={activeTab === 'photos' ? 'active' : ''}>
                    Фотографии
                </li>
                <li onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? 'active' : ''}>
                    Посты
                </li>
            </ul>
        </div>
    );
};

export default ProfileSidebar;
