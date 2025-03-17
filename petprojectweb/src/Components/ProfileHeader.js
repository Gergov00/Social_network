import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/ProfilePage.css';

const ProfileHeader = ({
    profileUser,
    currentUser,
    friendRequest,
    handleAddFriend,
    handleCancelRequest,
    handleAcceptRequest,
    handleRemoveFriend,
    onLogout,
}) => {
    const navigate = useNavigate();
    useEffect(() => {

    }, [friendRequest])

    return (
        <>
            <div className="profile-cover">
                <img
                    src={
                        profileUser?.coverURL ||
                        'https://sun9-33.userapi.com/impf/Ce-dT6lYDP47lpGzYqYOc0gq6ymBwiQrs9mXQw/UY7k4fz4OA0.jpg?size=1080x540&quality=96&crop=0,282,1080,540&sign=946773e0bd7b110559a5be6d138955ae'
                    }
                    alt="Cover"
                    className="cover-photo"
                />
            </div>
            <div className="profile-info">
                <div className="avatar-profile">
                    <img src={profileUser?.avatarURL} alt="Avatar" />
                </div>
                <div className="user-details">
                    <h1>
                        {profileUser?.firstName} {profileUser?.lastName}
                    </h1>
                    {currentUser?.id === profileUser?.id ? (
                        <>
                            <button onClick={() => navigate('/edit-profile')}>
                                Редактировать профиль
                            </button>
                            <button onClick={onLogout} style={{ marginLeft: '10px' }}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate(`/chat/${profileUser.id}`)}>
                                Написать сообщение
                            </button>
                            {friendRequest ? (
                                    (friendRequest.status === 'accepted' || friendRequest.message === "Ваш запрос в друзья принят") ? (
                                    <button
                                        onClick={handleRemoveFriend}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Удалить из друзей
                                    </button>
                                ) : (
                                    <>
                                        {currentUser.id === friendRequest.userId ? (
                                            <button
                                                onClick={handleCancelRequest}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Отменить заявку
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleAcceptRequest}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Принять заявку
                                            </button>
                                        )}
                                    </>
                                )
                            ) : (
                                <button
                                    onClick={handleAddFriend}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Добавить в друзья
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileHeader;
