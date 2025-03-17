import React, { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getFriends } from '../Services/Api';
import '../Assets/FriendsPage.css';

const FriendsPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchFriends() {
            try {
                // getFriends — функция в Api.js, которая обращается к эндпоинту /Friendships/friends?userId=<id>
                const data = await getFriends(user.id);
                setFriends(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (user) {
            fetchFriends();
        }
    }, [user]);

    if (!user) return <p>Пожалуйста, войдите в систему.</p>;
    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div className="friends-page">
            <h1>Мои друзья</h1>
            {friends.length === 0 ? (
                <p>У вас пока нет друзей.</p>
            ) : (
                <ul className="friends-list">
                    {friends.map((friend) => (
                        <li key={friend.id} onClick={() => navigate(`/profile/${friend.id}`)}>
                            <img
                                src={friend.avatarURL}
                                alt={`${friend.firstName} ${friend.lastName}`}
                                className="friend-avatar"
                            />
                            <span className="friend-name">
                                {friend.firstName} {friend.lastName}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FriendsPage;
