import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getConversation, sendMessage, getUserById } from '../Services/Api';
import { useUser } from '../Context/UserContext';
import useChat from '../Hooks/useChat';
import '../Assets/ChatPage.css';

const ChatPage = () => {
    const { friendId } = useParams();
    const { user: currentUser, token } = useUser();
    const [friend, setFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Получаем информацию о собеседнике
    useEffect(() => {
        async function fetchFriend() {
            try {
                const userData = await getUserById(friendId);
                setFriend(userData);
            } catch (err) {
                console.error(err);
            }
        }
        if (friendId) {
            fetchFriend();
        }
    }, [friendId]);

    // Получаем историю переписки (последние 20 сообщений)
    useEffect(() => {
        async function fetchConversation() {
            try {
                const conv = await getConversation(currentUser.id, friendId);
                const recentMessages = conv.slice(-20);
                setMessages(recentMessages);
            } catch (err) {
                console.error(err);
            }
        }
        if (friendId && currentUser) {
            fetchConversation();
        }
    }, [friendId, currentUser, token]);

    const handleReceiveMessage = useCallback((message) => {
        if (
            (message.senderId === currentUser.id && message.receiverId === parseInt(friendId)) ||
            (message.senderId === parseInt(friendId) && message.receiverId === currentUser.id)
        ) {
            setMessages((prevMessages) => [...prevMessages, message]);
        }
    }, [currentUser, friendId]);

    useChat(token, handleReceiveMessage);

    // Автопрокрутка вниз
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (newMessage.trim() === '') return;
        try {
            const sentMsg = await sendMessage(currentUser.id, friendId, newMessage);
            setMessages([...messages, sentMsg]);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                {friend && friend.avatarURL && (
                    <img
                        src={friend.avatarURL}
                        alt={`${friend.firstName} ${friend.lastName}`}
                        className="chat-friend-avatar"
                    />
                )}
                <h2>Чат с {friend ? `${friend.firstName} ${friend.lastName}` : 'пользователем'}</h2>
            </div>
            <div className="messages-container">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}
                    >
                        <p>{msg.content}</p>
                        <span>{new Date(msg.sentAt).toLocaleTimeString()}</span>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                />
                <button onClick={handleSend}>Отправить</button>
            </div>
        </div>
    );
};

export default ChatPage;
