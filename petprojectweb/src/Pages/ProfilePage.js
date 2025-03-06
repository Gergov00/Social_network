import React from 'react';
import '../Assets/ProfilePage.css';

const ProfilePage = () => {
    // Пример данных. В реальном приложении данные будут приходить из API.
    const user = {
        firstName: 'Иван',
        lastName: 'Иванов',
        status: 'Живу, чтобы создавать крутые проекты!',
        avatar: 'https://sun9-67.userapi.com/impg/122ZC_KLtNt1KTg6Olk2jYgr1WQdH62zwxwJdw/ZMcWC_je8NE.jpg?size=1080x1080&quality=95&sign=78551ad027007c75c109d7a88ee5424e&type=album', // замените на реальный URL аватара
        cover: 'https://via.placeholder.com/1200x300', // замените на реальный URL обложки
        about: 'Я люблю программирование, путешествия и спорт. Здесь можно разместить краткую информацию о себе.',
    };

    return (
        <div className="profile-container">
            <div className="profile-cover">
                <img src={user.cover} alt="Cover" className="cover-photo" />
            </div>
            <div className="profile-info">
                <div className="avatar">
                    <img src={user.avatar} alt="Avatar" />
                </div>
                <div className="user-details">
                    <h1>{user.firstName} {user.lastName}</h1>
                    <p className="status">{user.status}</p>
                </div>
            </div>
            <div className="profile-content">
                <div className="sidebar">
                    <ul className="menu">
                        <li>О себе</li>
                        <li>Друзья</li>
                        <li>Фотографии</li>
                        <li>Видео</li>
                        <li>Сообщения</li>
                    </ul>
                </div>
                <div className="main-content">
                    <h2>О себе</h2>
                    <p>{user.about}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
