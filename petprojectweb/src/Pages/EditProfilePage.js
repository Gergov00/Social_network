import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../Services/Api';
import '../Assets/EditProfilePage.css';
import { useUser } from '../Context/UserContext';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useUser();

    useEffect(() => {
        if (!user) {
            navigate('/auth');
        }
    }, [user, navigate]);

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [about, setAbout] = useState(user?.about || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(user?.avatarURL || '');
    const [previewCover, setPreviewCover] = useState(user?.coverURL || '');
    const [removeAvatar, setRemoveAvatar] = useState(false);
    const [removeCover, setRemoveCover] = useState(false);
    const [error, setError] = useState('');


    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            const previewURL = URL.createObjectURL(e.target.files[0]);
            setPreviewAvatar(previewURL);
            setRemoveAvatar(false); // сброс удаления, если выбран новый файл
        }
    };

    const handleCoverChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCoverFile(e.target.files[0]);
            const previewURL = URL.createObjectURL(e.target.files[0]);
            setPreviewCover(previewURL);
            setRemoveCover(false);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setPreviewAvatar('');
        setRemoveAvatar(true);
    };

    const handleRemoveCover = () => {
        setCoverFile(null);
        setPreviewCover('');
        setRemoveCover(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await updateProfile(
                user.id,
                firstName,
                lastName,
                avatarFile,
                coverFile,
                about,
                removeAvatar,
                removeCover
            );
            console.log(updatedUser);
            localStorage.setItem("user", updatedUser);
            updateUser(updatedUser);
            console.log(localStorage.getItem("user"));
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
                    />
                </div>
                <div>
                    <label>О себе:</label>
                    <input
                        type="text"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                </div>
                <div>
                    <label>Аватар:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                    {previewAvatar ? (
                        <div>
                            <p>Предпросмотр аватарки:</p>
                            <img src={previewAvatar} alt="PreviewAvatar" style={{ width: '100px', height: '100px' }} />
                            {previewAvatar !== "http://gergovzaurbek.online/images/default-avatar.png" ? <button type="button" onClick={handleRemoveAvatar}>Удалить аватарку</button> : ''}
                        </div>
                    ) : (
                        removeAvatar && <p>Аватарка будет удалена</p>
                    )}
                </div>
                <div>
                    <label>Обложка:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                    />
                    {previewCover ? (
                        <div>
                            <p>Предпросмотр обложки:</p>
                            <img src={previewCover} alt="PreviewCover" style={{ width: '480px', height: '120px' }} />
                            <button type="button" onClick={handleRemoveCover}>Удалить обложку</button>
                        </div>
                    ) : (
                        removeCover && <p>Обложка будет удалена</p>
                    )}
                </div>
                <button type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
};

export default EditProfilePage;
