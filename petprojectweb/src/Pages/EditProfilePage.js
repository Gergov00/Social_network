import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../Services/Api'; 
import '../Assets/EditProfilePage.css';

const EditProfilePage = () => {
    const navigate = useNavigate();

    const savedUser = localStorage.getItem("user");
    const initialUser = savedUser ? JSON.parse(savedUser) : null;

    useEffect(() => {
        if (!initialUser) {
            navigate('/auth');
        }
    }, [initialUser, navigate]);

    const [firstName, setFirstName] = useState(initialUser?.firstName || '');
    const [lastName, setLastName] = useState(initialUser?.lastName || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(initialUser?.avatarURL || '');
    const [error, setError] = useState('');

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            const previewURL = URL.createObjectURL(e.target.files[0]);
            setPreviewAvatar(previewURL);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await updateProfile(initialUser.id, firstName, lastName, avatarFile);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            navigate('/profile');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="edit-profile-container">
            <h1>Редактировать профиль</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Имя:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Фамилия:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Аватар:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                    {previewAvatar && (
                        <div>
                            <p>Предпросмотр аватарки:</p>
                            <img src={previewAvatar} alt="Preview" style={{ width: '100px', height: '100px' }} />
                        </div>
                    )}
                </div>
                <button type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
};

export default EditProfilePage;
