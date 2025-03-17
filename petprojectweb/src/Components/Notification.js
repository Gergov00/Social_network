import React, { useState, useEffect } from 'react';
import useNotifications from '../Hooks/useNotifications';
import NotificationItem from './NotificationItem';
import '../Assets/Notification.css';
import { acceptFriendRequest, getFriendRequests } from '../Services/Api';
import { useUser } from '../Context/UserContext'


const Notification = ({ userId }) => {
    const {token } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);


    useEffect(() => {
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

    const handleReceiveNotification = (notification) => {
        if (notification.message === 'Новый запрос в друзья') {
            setNotifications(prev => [...prev, notification]);
        }
    };

    const handleReceiveCancelNotification = (cancelInfo) => {
        setNotifications(prev => prev.filter(n => n.id !== cancelInfo.id));
    };

    useNotifications(token, handleReceiveNotification, handleReceiveCancelNotification);


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
                    {(notifications?.length === 0 || !notifications) && <p>Нет новых уведомлений</p>}
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
