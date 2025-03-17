// src/Pages/MessagesPage.js
import React, { useEffect, useState } from 'react';
import { getChats, getUserById } from '../Services/Api';
import { useUser } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import '../Assets/MessagesPage.css';

const MessagesPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchChats() {
            try {
                // Получаем список чатов по user.id
                const data = await getChats(user.id);
                console.log(data);
                // Для каждого диалога подгружаем данные о собеседнике
                const chatsWithUserInfo = await Promise.all(data.map(async (chat) => {
                    const friendId = chat.chatWith;
                    const friendData = await getUserById(friendId);
                    return { ...chat, friend: friendData };
                }));
                
                setChats(chatsWithUserInfo);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (user) {
            fetchChats();
        }
    }, [user]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div className="messages-page">
            <h1>Сообщения</h1>
            {chats.length === 0 ? (
                <p>У вас нет активных чатов.</p>
            ) : (
                <ul className="chats-list">
                    {chats.map(chat => (
                        <li
                            key={chat.lastMessage.receiverId}
                            className="chat-item"
                            onClick={() => navigate(`/chat/${chat.friend.id}`)}
                        >
                            <img
                                src={chat.friend.avatarURL}
                                alt={`${chat.friend.firstName} ${chat.friend.lastName}`}
                                className="chat-avatar"
                            />
                            <div className="chat-info">
                                <p className="chat-friend-name">
                                    {chat.friend.firstName} {chat.friend.lastName}
                                </p>
                                <p className="chat-last-message">
                                    {chat.lastMessage.content}
                                </p>
                                <p className="chat-time">
                                    {new Date(chat.lastMessage.sentAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MessagesPage;
