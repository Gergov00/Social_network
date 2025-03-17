// src/Pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Assets/ProfilePage.css';
import { getUserById, sendFriendRequest, getFriendRequest, cancelFriendRequest, acceptFriendRequest, removeFriendship } from '../Services/Api';
import { useUser } from '../Context/UserContext';
import ProfileHeader from '../Components/ProfileHeader';
import ProfileSidebar from '../Components/ProfileSidebar';
import ProfileContent from '../Components/ProfileContent';
import useNotifications from '../Hooks/useNotifications';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { userId: routeUserId } = useParams();
    const { user: currentUser, logoutUser, token } = useUser();
    const [profileUser, setProfileUser] = useState(null);
    const [activeTab, setActiveTab] = useState('about');
    const [friendRequest, setFriendRequest] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            navigate('/auth');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        if (routeUserId) {
            getUserById(routeUserId)
                .then(data => setProfileUser(data))
                .catch(err => console.error(err));
        } else {
            setProfileUser(currentUser);
        }
    }, [routeUserId, currentUser]);

    // Проверка наличия запроса в друзья для профиля другого пользователя
    useEffect(() => {
        async function checkFriendRequest() {
            try {
                const req = await getFriendRequest(currentUser.id, profileUser.id);
                setFriendRequest(req);
            } catch (error) {
                console.error('Ошибка проверки запроса в друзья:', error);
            }
        }
        if (currentUser && profileUser && currentUser.id !== profileUser.id) {
            checkFriendRequest();
        }
    }, [currentUser, profileUser]);


    const acceptOrSendReq = (notification) => {
        // Если уведомление означает, что заявка принята,
        // и текущий пользователь (отправитель) соответствует тому, кому адресовано уведомление (FriendId),
        // обновляем состояние friendRequest.



        if (
            (notification.message === 'Ваш запрос в друзья принят') &&
            currentUser.id.toString() === notification.userId.toString()
        ) {
            setFriendRequest(notification);
            return;
        }
        if ((notification.message === 'Новый запрос в друзья' || notification.message === 'Вы приняли запрос в друзья') &&
            currentUser.id.toString() === notification.friendId.toString()
        ) {
            setFriendRequest(notification);
        }

    }

    const cancelOrDlete = (notification) => {
        if (notification.message === 'Запрос в друзья отменен') {
            setFriendRequest(null);
        }
    }


    // Подписка на уведомления через SignalR
    useNotifications(token, acceptOrSendReq, cancelOrDlete);


    // Обработчики для запросов в друзья
    const handleAddFriend = async () => {
        try {
            const req = await sendFriendRequest(currentUser.id, profileUser.id);
            setFriendRequest(req);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCancelRequest = async () => {
        try {
            await cancelFriendRequest(friendRequest.id);
            setFriendRequest(null);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleAcceptRequest = async () => {
        try {
            const accepted = await acceptFriendRequest(friendRequest.id);
            setFriendRequest(accepted);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleRemoveFriend = async () => {
        try {
            await removeFriendship(friendRequest.id);
            setFriendRequest(null);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/auth');
    };

    if (!profileUser) return <p>Загрузка...</p>;

    return (
        <div className="profile-container">
            <ProfileHeader
                profileUser={profileUser}
                currentUser={currentUser}
                friendRequest={friendRequest}
                handleAddFriend={handleAddFriend}
                handleCancelRequest={handleCancelRequest}
                handleAcceptRequest={handleAcceptRequest}
                handleRemoveFriend={handleRemoveFriend}
                onLogout={handleLogout}
            />
            <div className="profile-content">
                <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="main-content">
                    <ProfileContent
                        activeTab={activeTab}
                        profileUser={profileUser}
                        currentUser={currentUser}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
