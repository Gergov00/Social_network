import React, { useState, useEffect } from 'react';
import { getUserById } from '../Services/Api';
import '../Assets/Notification.css';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ request, onAccept }) => {
    const [sender, setSender] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(request);
        getUserById(request.userId)
            .then(data => setSender(data))
            .catch(err => console.error('Ошибка получения данных пользователя:', err));
    }, [request.userId]);

    return (
        <div className="notification-item">
            <div onClick={() => navigate(`/profile/${request.userId}`)}>
                {sender && sender.avatarURL && (
                    <img
                        src={sender.avatarURL}
                        alt={`${sender.firstName} ${sender.lastName}`}
                        className="notification-avatar"
                        style={{ width: 40, height: 40, borderRadius: '50%', marginRight: '8px' }}
                    />
                )}
                <p >
                    <span className="notification-name">
                        {sender
                            ? `${sender.firstName} ${sender.lastName}`
                            : 'Загрузка...'}
                    </span>{' '}
                    хочет добавить вас в друзья
                </p>
            </div>
            <button onClick={() => onAccept(request.id)}>Принять</button>
        </div>
    );
};

export default NotificationItem;
