import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import NotificationItem from './NotificationItem';
import '../Assets/Notification.css';
import { acceptFriendRequest, getFriendRequests } from '../Services/Api';


const Notification = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);


    useEffect(() => {
        // Получаем запросы в друзья для текущего пользователя
        async function fetchFriendRequests() {
            try {
                const requests = await getFriendRequests(userId);
                setNotifications(requests);
            } catch (error) {
                console.error(error);
            }
        }
        if (userId) {
            fetchFriendRequests();
        }

    }, [userId]);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:32769/notificationsHub')
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log('Соединение установлено' + new Date().toISOString()))
            .catch(err => console.error('Ошибка подключения:', err + new Date().toISOString()));
        connection.on('ReceiveNotification', (notification) => {
            setNotifications(prev => {
                const index = prev.findIndex(n => n.FriendId === notification.FriendId && n.UserId === notification.UserId);
                if (index !== -1) {
                    
                    const newNotifications = [...prev];
                    newNotifications[index] = notification;
                    return newNotifications;
                } else {
                    return [...prev, notification];
                }
            });
        });

        connection.on('ReceiveCancelNotification', (cancelInfo) => {
            setNotifications(prev => {
                console.log(prev);
                return prev.filter(n => n.id !== cancelInfo.id)
            });
        });

        return () => {
            connection.stop();
        };
    }, []);


    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };


    const handleAcceptRequest = async (requestId) => {
        try {
            await acceptFriendRequest(requestId);
            setNotifications(notifications.filter(req => req.id !== requestId));
        } catch (error) {
            console.error(error);
        }
    };

    return (

        <div className="notifications-container">
                <button className="notifications-button" onClick={toggleNotifications}>
                    🔔
                {notifications?.length > 0 && (
                    <span className="notification-count">{notifications?.length}</span>
                    )}
                </button>
                {showNotifications && (
                    <div className="notifications-dropdown">
            {notifications?.length === 0 && <p>Нет новых уведомлений</p>}
            {notifications ? notifications.map(notification => (
                <NotificationItem
                    key={notification.Id}
                    request={notification}
                    onAccept={handleAcceptRequest}
                />
            )) : ''}
        </div>
                )}
            </div>

        
    );
};

export default Notification;
