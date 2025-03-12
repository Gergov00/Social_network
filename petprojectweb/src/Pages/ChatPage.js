import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getConversation, sendMessage, getUserById } from '../Services/Api';
import { useUser } from '../Context/UserContext';
import '../Assets/ChatPage.css';

const ChatPage = () => {
    const { friendId } = useParams();
    const { user: currentUser } = useUser();
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

    // Получаем историю переписки между текущим пользователем и собеседником
    useEffect(() => {
        async function fetchConversation() {
            try {
                const conv = await getConversation(currentUser.id, friendId);
                setMessages(conv);
            } catch (err) {
                console.error(err);
            }
        }
        if (friendId && currentUser) {
            fetchConversation();
        }
    }, [friendId, currentUser]);

    // Прокрутка списка сообщений вниз при обновлении
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
            <h2>Чат с {friend ? `${friend.firstName} ${friend.lastName}` : 'пользователем'}</h2>
            <div className="messages-container">
                {messages.map(msg => (
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
