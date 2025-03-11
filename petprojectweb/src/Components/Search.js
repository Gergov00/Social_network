import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/UserItem.css';

export const VkUserItem = ({ user }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profile/${user.id}`);
    };

    return (
        <div className="user-item" onClick={handleClick}>
            <img
                className="user-avatar"
                src={user.avatarURL}
                alt={`${user.firstName} ${user.lastName}`}
            />
            <div className="user-name">
                {user.firstName} {user.lastName}
            </div>
        </div>
    );
};

export default VkUserItem;

export const SearchResults = ({ users }) => {
    return (
        <div>
            {users.map(user => (
                <VkUserItem key={user.id} user={user} />
            ))}
        </div>
    );
};

