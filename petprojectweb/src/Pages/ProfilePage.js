import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Assets/ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Функция безопасного парсинга JSON
    function safeParse(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Ошибка парсинга JSON:", error);
            return null;
        }
    }

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? safeParse(savedUser) : null;
    });

    useEffect(() => {
        if (!user) {
            console.log("Нет сохраненных данных пользователя");
            navigate('/auth');
        }
    }, [user, navigate]);

    if (!user) {
        return <p>Пользователь не авторизован. Пожалуйста, выполните вход.</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-cover">
                <img
                    src={user.cover || 'https://sun9-33.userapi.com/impf/Ce-dT6lYDP47lpGzYqYOc0gq6ymBwiQrs9mXQw/UY7k4fz4OA0.jpg?size=1080x540&quality=96&crop=0,282,1080,540&sign=946773e0bd7b110559a5be6d138955ae&c_uniq_tag=C8OiUIWg_d6fe85Csb3efUS3CWNvKXmzv5ZsLqQ9ghM&type=helpers&quot'}
                    alt="Cover"
                    className="cover-photo"
                />
            </div>
            <div className="profile-info">
                <div className="avatar">
                    <img
                        src={user.avatarURL}
                        alt="Avatar"
                    />
                </div>
                <div className="user-details">
                    <h1>{user.firstName} {user.lastName}</h1>
                    <p className="status">{user.status || 'Статус не указан'}</p>
                    {/* Кнопка для перехода на страницу редактирования профиля */}
                    <button onClick={() => navigate('/edit-profile')}>
                        Редактировать профиль
                    </button>
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
                    <p>{user.about || 'Информация отсутствует'}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
